/**
 * @module     AI Service
 * @author     Bethmi Jayamila <bethmij@gmail.com>
 * @description This file is part of the AI Damage Detection service of FleetGuard AI.
 *              Developed and trained by Bethmi Jayamila.
 * @date       2026-02-23
 */

const tf = require('@tensorflow/tfjs');
const fs = require('fs');
const path = require('path');
const jpeg = require('jpeg-js');

const DATASET_PATH = path.join(__dirname, 'dataset', 'data1a', 'training');
const MODEL_SAVE_PATH = 'file://' + path.join(__dirname, 'model-dist');
const IMG_SIZE = 128;
const BATCH_SIZE = 16;

function decodeImage(filePath) {
    const rawData = fs.readFileSync(filePath);
    const jpegData = jpeg.decode(rawData, {useTArray: true});
    const numChannels = 3;
    const numPixels = jpegData.width * jpegData.height;
    const values = new Int32Array(numPixels * numChannels);

    for (let i = 0; i < numPixels; i++) {
        for (let channel = 0; channel < numChannels; ++channel) {
            values[i * numChannels + channel] = jpegData.data[i * 4 + channel];
        }
    }

    const outShape = [jpegData.height, jpegData.width, numChannels];
    const imageTensor = tf.tensor3d(values, outShape, 'int32');
    
    // Resize & normalize
    const resized = tf.image.resizeBilinear(imageTensor, [IMG_SIZE, IMG_SIZE]);
    const normalized = resized.toFloat().sub(127.5).div(127.5);
    
    tf.dispose([imageTensor, resized]);
    return normalized;
}

async function loadData() {
    console.log("Reading dataset from:", DATASET_PATH);
    const classes = ['01-whole', '00-damage']; // 0 = whole, 1 = damage
    const images = [];
    const labels = [];

    for (let c = 0; c < classes.length; c++) {
        const classDir = path.join(DATASET_PATH, classes[c]);
        if (!fs.existsSync(classDir)) continue;

        const files = fs.readdirSync(classDir).filter(f => f.match(/\.(jpg|jpeg)$/i));
        const sampleSize = Math.min(files.length, 10); // 10 images per class for pure JS speed
        console.log(`Loading ${sampleSize} images for class ${classes[c]}...`);

        for (let i = 0; i < sampleSize; i++) {
            try {
                images.push(decodeImage(path.join(classDir, files[i])));
                labels.push(c);
            } catch (err) {
                // Ignore corrupt/unsupported images
            }
        }
    }

    if (images.length === 0) throw new Error("No valid images found.");

    const xTrain = tf.stack(images);
    const yTrain = tf.tensor1d(labels, 'int32');
    const yTrainOneHot = tf.oneHot(yTrain, classes.length);

    console.log(`Loaded ${images.length} images. Tensor shape: ${xTrain.shape}`);
    return { xTrain, yTrain: yTrainOneHot };
}

function createModel() {
    const model = tf.sequential();
    
    model.add(tf.layers.flatten({ inputShape: [IMG_SIZE, IMG_SIZE, 3] }));
    model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 2, activation: 'softmax' })); // whole vs damage
    
    model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy', metrics: ['accuracy'] });
    return model;
}

async function train() {
    const { xTrain, yTrain } = await loadData();
    const model = createModel();

    console.log("Starting model training (pure JS)...");
    await model.fit(xTrain, yTrain, {
        epochs: 1, // Just to demonstrate real training quickly
        batchSize: BATCH_SIZE,
        shuffle: true,
        callbacks: {
            onEpochEnd: (epoch, logs) => console.log(`Epoch ${epoch + 1}: loss = ${logs.loss.toFixed(4)}, acc = ${logs.acc.toFixed(4)}`)
        }
    });

    console.log("Training complete. Saving model...");
    await model.save(MODEL_SAVE_PATH);
    console.log(`Model saved to ${MODEL_SAVE_PATH}`);
}

train().catch(console.error);
