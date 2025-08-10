
import { Delaunay } from 'd3-delaunay';
import { MapData, NationMapData, MAP_WIDTH, MAP_HEIGHT } from "../types";

const MIN_CAPITAL_DISTANCE_SQUARED = 150 * 150; // Min distance between nation capitals
const NUM_STATES = 200; // Increased from 80 for larger state regions
const NUM_UNKNOWN_POINTS = 200; // Increased from 120 for a denser containment wall
const MAX_CAPITAL_PLACEMENT_ATTEMPTS = 50;


// Simple pseudo-random number generator for deterministic results
function createSeededRandom(seed: number) {
    let state = seed;
    return function() {
        state = (state * 1664525 + 1013904223) % 4294967296;
        return state / 4294967296;
    };
}

function isCapitalTooClose(point: {x: number, y: number}, points: {x: number, y: number}[]) {
    for (const p of points) {
        const dx = p.x - point.x;
        const dy = p.y - point.y;
        if ((dx * dx + dy * dy) < MIN_CAPITAL_DISTANCE_SQUARED) {
            return true;
        }
    }
    return false;
}

export const generateMapLayout = async (
  nations: { name: string; hint: string; icon: string }[],
  seed: number
): Promise<MapData> => {
    const random = createSeededRandom(seed);
    
    // 1. Create a dense wall of unknown region points on the periphery
    const unknownSites: { name: string, point: {x:number, y:number} }[] = [];
    const center = { x: MAP_WIDTH / 2, y: MAP_HEIGHT / 2 };
    const radiusX = MAP_WIDTH / 2;
    const radiusY = MAP_HEIGHT / 2;
    const edgeBuffer = 5;
    const jitter = 30; // Reduced from 50 for a more consistent wall

    for (let i = 0; i < NUM_UNKNOWN_POINTS; i++) {
        const angle = (i / NUM_UNKNOWN_POINTS) * 2 * Math.PI;
        const rX = radiusX - edgeBuffer - (random() * jitter);
        const rY = radiusY - edgeBuffer - (random() * jitter);
        
        const point = {
            x: center.x + Math.cos(angle) * rX,
            y: center.y + Math.sin(angle) * rY,
        };
        unknownSites.push({
            name: `Ocean`,
            point,
        });
    }
    const unknownPoints = unknownSites.map(s => s.point);

    // 2. Generate points for the potential "states" in a more constrained central area to ensure they are surrounded
    const stateSites: { point: {x: number, y: number} }[] = [];
    const centralArea = { x: 120, y: 120, width: MAP_WIDTH - 240, height: MAP_HEIGHT - 240 };
    for (let i = 0; i < NUM_STATES; i++) {
        stateSites.push({
            point: {
                x: centralArea.x + random() * centralArea.width,
                y: centralArea.y + random() * centralArea.height,
            }
        });
    }
    const statePoints = stateSites.map(s => s.point);
    
    // 3. Select Capital states for each nation from the generated state sites
    const capitalIndices: number[] = []; // Indices within the stateSites array
    const placedCapitals: {x: number, y: number}[] = [];

    for (let i = 0; i < nations.length; i++) {
        let bestIndex = -1;
        let attempts = 0;
        while(attempts < MAX_CAPITAL_PLACEMENT_ATTEMPTS) {
            const randomIndex = Math.floor(random() * stateSites.length);
            if (capitalIndices.includes(randomIndex)) {
                attempts++;
                continue;
            }
            const candidatePoint = stateSites[randomIndex].point;
            if (!isCapitalTooClose(candidatePoint, placedCapitals)) {
                bestIndex = randomIndex;
                break;
            }
            attempts++;
        }
        if (bestIndex === -1) { // Fallback if no ideal spot is found
            bestIndex = Math.floor(random() * stateSites.length);
            while(capitalIndices.includes(bestIndex)) {
                bestIndex = (bestIndex + 1) % stateSites.length;
            }
        }
        capitalIndices.push(bestIndex);
        placedCapitals.push(stateSites[bestIndex].point);
    }

    // 4. Region-growing algorithm to assign states to nations
    const allKnownPoints = [...statePoints, ...unknownPoints];
    const delaunay = Delaunay.from(allKnownPoints.map(p => [p.x, p.y] as [number, number]));

    const stateOwners: (string | null)[] = new Array(stateSites.length).fill(null);
    const expansionQueue: number[][] = nations.map(() => []);

    // Initialize queues with capital states
    capitalIndices.forEach((capitalIndex, nationIndex) => {
        stateOwners[capitalIndex] = nations[nationIndex].name;
        expansionQueue[nationIndex].push(capitalIndex);
    });

    let statesToClaim = stateSites.length - nations.length;
    let turn = 0;
    while(statesToClaim > 0) {
        const nationIndex = turn % nations.length;
        const queue = expansionQueue[nationIndex];
        
        if (queue.length === 0) {
            turn++;
            if (turn > nations.length * 2 && expansionQueue.every(q => q.length === 0)) break; // Prevent infinite loops
            continue; // This nation can't expand further for now
        }
        
        const frontierSize = queue.length;
        for(let i = 0; i < frontierSize; i++) {
            const currentStateIndex = queue.shift()!;
            
            for (const neighborIndex of delaunay.neighbors(currentStateIndex)) {
                if (neighborIndex < stateSites.length && stateOwners[neighborIndex] === null) {
                    stateOwners[neighborIndex] = nations[nationIndex].name;
                    queue.push(neighborIndex);
                    statesToClaim--;
                }
            }
        }
        turn++;
    }

    // 5. Generate Voronoi Diagram and construct final map data
    const voronoi = delaunay.voronoi([0, 0, MAP_WIDTH, MAP_HEIGHT]);
    const finalMapData: NationMapData[] = [];

    // Add known nation states
    stateSites.forEach((site, i) => {
        const ownerName = stateOwners[i];
        if (!ownerName) return;

        const ownerNation = nations.find(n => n.name === ownerName)!;
        const polygon = voronoi.cellPolygon(i);
        finalMapData.push({
            ownerNationName: ownerName,
            center: site.point,
            territory: (polygon || []) as [number, number][],
            isKnown: true,
            isCapitalState: capitalIndices.some(capIndex => capIndex === i),
            icon: ownerNation.icon,
        });
    });

    // Add unknown regions
    unknownSites.forEach((site, i) => {
        const polygon = voronoi.cellPolygon(stateSites.length + i);
        finalMapData.push({
            ownerNationName: site.name,
            center: site.point,
            territory: (polygon || []) as [number, number][],
            isKnown: false,
            isCapitalState: false,
            icon: 'ship',
        });
    });

    return finalMapData;
};
