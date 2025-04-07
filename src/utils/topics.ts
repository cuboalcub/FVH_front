export const BASE_TOPIC = "homeaws://192.168.168.151:8083/mqtt";

// Objetos base
export const sensorType = {
    temperature: "temperature",
    humidity: "humidity",
    light: "light",
    waterLevel: "water_level"
} as const;

export const actuatorType = {
    sprinkler: "sprinkler",
    light: "light",
    notification: "notification",
    waterPump: "waterPump"
} as const;

// Tipos derivados automáticamente
export type SensorType = typeof sensorType[keyof typeof sensorType];
export type ActuatorType = typeof actuatorType[keyof typeof actuatorType];

// Funciones para construir el topic
export const SENSOR_TOPIC = {
    base: (id: number, type: SensorType) => `greenhouse/${id}/sensor/${type}`
};

export const ACTUATOR_TOPIC = {
    base: (id: number, type: ActuatorType) => `greenhouse/${id}/actuator/${type}`
};
