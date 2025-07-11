import { useEffect, useState } from 'react';
import Fuse from 'fuse.js';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import * as tf from '@tensorflow/tfjs';

export const useHybridSearch = (data = [], accessor = 'name') => {
    const [model, setModel] = useState(null);
    const [embeddings, setEmbeddings] = useState(null);
    const [isReady, setIsReady] = useState(false);

    const getValue = typeof accessor === 'function'
        ? accessor
        : (item) => item?.[accessor] ?? '';

    // Load the USE model once
    useEffect(() => {
        use.load().then(setModel).catch(console.error);
    }, []);

    // Embed data whenever model or data changes
    useEffect(() => {
        const embedData = async () => {
            if (!model || data.length === 0) return;

            const texts = data.map(getValue);
            const embedded = await model.embed(texts);
            setEmbeddings(embedded);
            setIsReady(true);
        };
        embedData();
    }, [model, data, accessor]);

    const search = async (query) => {
        if (!query || !isReady || !model || !embeddings) return data;

        // 1. Fuse.js fuzzy search
        const fuse = new Fuse(data, {
            keys: [getValue],
            threshold: 0.4,
            distance: 100,
            includeScore: true,
            getFn: (obj, path) => getValue(obj)
        });

        const fuseResults = fuse.search(query).map(r => ({
            item: r.item,
            fuseScore: 1 - r.score
        }));

        const queryEmbedding = await model.embed([query]);
        const queryVec = queryEmbedding.arraySync()[0];

        // 2. Compute cosine similarity
        const sims = embeddings.arraySync().map((vec, i) => {
            const dot = tf.tensor(vec).dot(tf.tensor(queryVec)).arraySync();
            return {
                item: data[i],
                semanticScore: dot
            };
        });

        // 3. Merge both scores
        const merged = fuseResults.map(r => {
            const match = sims.find(s => s.item.id === r.item.id);
            return {
                item: r.item,
                score: (r.fuseScore * 0.7) + (match?.semanticScore || 0) * 0.3
            };
        });

        return merged.sort((a, b) => b.score - a.score).map(r => r.item);
    };

    return { search, isReady };
};
