import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras import layers, models

IMG_SIZE = 180
BATCH = 32

train_datagen = ImageDataGenerator(
    rescale=1./255,
    validation_split=0.2,
    rotation_range=25,
    zoom_range=0.2,
    horizontal_flip=True,
    vertical_flip=True,
    shear_range=0.2
)

train_gen = train_datagen.flow_from_directory(
    "/kaggle/input/plantvillage-potato-disease-dataset/PlantVillage",
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH,
    subset='training',
    class_mode='categorical'
)

val_gen = train_datagen.flow_from_directory(
    "/kaggle/input/plantvillage-potato-disease-dataset/PlantVillage",
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH,
    subset='validation',
    class_mode='categorical'
)

print(train_gen.class_indices)
model = models.Sequential([
    
    layers.Conv2D(32, (3,3), activation='relu', input_shape=(IMG_SIZE,IMG_SIZE,3)),
    layers.MaxPooling2D(2,2),

    layers.Conv2D(64, (3,3), activation='relu'),
    layers.MaxPooling2D(2,2),

    layers.Conv2D(128, (3,3), activation='relu'),
    layers.MaxPooling2D(2,2),

    layers.Conv2D(256, (3,3), activation='relu'),
    layers.MaxPooling2D(2,2),

    layers.Flatten(),
    layers.Dense(256, activation='relu'),
    layers.Dropout(0.4),

    layers.Dense(128, activation='relu'),
    layers.Dropout(0.3),

    layers.Dense(3, activation='softmax')
])

model.compile(
    optimizer=tf.keras.optimizers.Adam(1e-4),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

model.summary()
history = model.fit(
    train_gen,
    validation_data=val_gen,
    epochs=20
)
model.save("potato_model.h5")
print("Model saved!")