
import { Delaunay } from 'd3-delaunay';
import { MapData, MAP_WIDTH, MAP_HEIGHT } from '../types';

// A simple pseudo-random number generator (PRNG) for deterministic results.
function createSeededRandom(seed: number) {
    let state = seed;
    return function() {
        state = (state * 1664525 + 1013904223) % 4294967296;
        return state / 4294967296;
    };
}

/**
 * Recursively displaces the midpoint of a line segment to create a jagged effect.
 * This version of the function returns the complete segment including start and end points.
 * @param p1 The start point of the segment.
 * @param p2 The end point of the segment.
 * @param roughness A factor controlling the magnitude of the displacement.
 * @param recursionDepth The number of recursive steps to perform.
 * @param random A seeded random function to ensure determinism.
 * @returns An array of new points forming the jagged line from p1 to p2.
 */
function displace(p1: [number, number], p2: [number, number], roughness: number, recursionDepth: number, random: () => number): [number, number][] {
    if (recursionDepth <= 0) {
        return [p1, p2];
    }

    const midX = (p1[0] + p2[0]) / 2;
    const midY = (p1[1] + p2[1]) / 2;

    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    
    const normalX = -dy;
    const normalY = dx;
    
    const length = Math.sqrt(dx * dx + dy * dy);
    if (length < 1) return [p1, p2];
    
    const normalizedNormalX = normalX / length;
    const normalizedNormalY = normalY / length;

    const randomOffset = (random() - 0.5) * roughness * length;
    
    const newMidX = midX + normalizedNormalX * randomOffset;
    const newMidY = midY + normalizedNormalY * randomOffset;

    const newMidPoint: [number, number] = [newMidX, newMidY];

    const newRoughness = roughness * 0.55;
    
    const part1 = displace(p1, newMidPoint, newRoughness, recursionDepth - 1, random);
    const part2 = displace(newMidPoint, p2, newRoughness, recursionDepth - 1, random);
    
    // Combine the two parts, removing the duplicate midpoint
    return [...part1.slice(0, -1), ...part2];
}


/**
 * Generates complex, non-overlapping territories by applying a jagged effect to shared Voronoi borders.
 * This is the main function that orchestrates the new map generation pass.
 * @param mapData The initial map data with simple Voronoi polygons and capital locations.
 * @param seed The world seed for deterministic randomness.
 * @param roughness A factor controlling how "chaotic" the borders are.
 * @param recursionDepth The level of detail for the jagged edges.
 * @returns A new MapData array with complex, perfectly fitting territory polygons.
 */
export function generateJaggedTerritories(
    mapData: MapData,
    seed: number,
    roughness = 0.5,
    recursionDepth = 3
): MapData {
    if (!mapData || mapData.length === 0 || !mapData[0].center) {
        return mapData; // Return original data if it's invalid
    }

    const points = mapData.map(d => [d.center.x, d.center.y] as [number, number]);
    const delaunay = Delaunay.from(points);
    const voronoi = delaunay.voronoi([0, 0, MAP_WIDTH, MAP_HEIGHT]);

    const edgeToJaggedPath = new Map<string, [number, number][]>();
    
    const vertexToString = (v: [number, number]): string => `${v[0].toFixed(3)},${v[1].toFixed(3)}`;

    // Iterate through all Voronoi cells to find unique shared edges
    for (let i = 0; i < mapData.length; i++) {
        const polygon = voronoi.cellPolygon(i);
        if (!polygon) continue;

        for (let j = 0; j < polygon.length; j++) {
            const p1 = polygon[j];
            const p2 = polygon[(j + 1) % polygon.length];
            
            // Create a canonical key for the edge to avoid processing it twice
            const key = [vertexToString(p1), vertexToString(p2)].sort().join('-');
            
            if (!edgeToJaggedPath.has(key)) {
                // Find the neighboring cell that shares this edge
                const neighbors = voronoi.neighbors(i);
                let isShared = false;
                for(const neighborIndex of neighbors) {
                    const neighborPolygon = voronoi.cellPolygon(neighborIndex);
                    if(!neighborPolygon) continue;
                    
                    const neighborVertices = new Set(neighborPolygon.map(vertexToString));
                    if(neighborVertices.has(vertexToString(p1)) && neighborVertices.has(vertexToString(p2))) {
                        isShared = true;
                        break;
                    }
                }

                // Only apply displacement to shared internal borders, not the outer canvas edges
                if(isShared) {
                    const edgeSeed = seed + key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                    const edgeRandom = createSeededRandom(edgeSeed);
                    const jaggedSegment = displace(p1, p2, roughness, recursionDepth, edgeRandom);
                    edgeToJaggedPath.set(key, jaggedSegment);
                }
            }
        }
    }
    
    // Reconstruct the territories using the new jagged edges
    const newMapData: MapData = mapData.map((nation, i) => {
        const originalPolygon = voronoi.cellPolygon(i);
        if (!originalPolygon) {
            return { ...nation, territory: [] };
        }

        const newTerritory: [number, number][] = [];
        
        for (let j = 0; j < originalPolygon.length; j++) {
            const p1 = originalPolygon[j];
            const p2 = originalPolygon[(j + 1) % originalPolygon.length];
            
            const key = [vertexToString(p1), vertexToString(p2)].sort().join('-');
            const jaggedEdge = edgeToJaggedPath.get(key);

            if (jaggedEdge) {
                const jaggedStartStr = vertexToString(jaggedEdge[0]);
                const p1Str = vertexToString(p1);
                
                let segmentToAdd: [number, number][];
                if (p1Str === jaggedStartStr) {
                    segmentToAdd = jaggedEdge;
                } else {
                    segmentToAdd = [...jaggedEdge].reverse();
                }
                // Add all points of the segment except the last one, as it will be the start of the next segment.
                newTerritory.push(...segmentToAdd.slice(0, -1));
            } else {
                // This is an outer hull edge, just add its starting point.
                newTerritory.push(p1);
            }
        }

        return {
            ...nation,
            territory: newTerritory,
        };
    });

    return newMapData;
}