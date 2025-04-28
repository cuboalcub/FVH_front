import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import BackgroundWrapper from './background';
import { LineChart } from 'react-native-chart-kit';
import CustomBottomBar from './barraInferior';

export default function SensorDataScreen() {
    const handleCalibration = () => alert('Calibracion realizada');

    const [chartData, setChartData] = useState({
        labels: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }]
    });

    return (

        <BackgroundWrapper>
            <Text style={styles.title}>Sensores</Text>

            <LineChart
                data={chartData}
                width={350}
                height={220}
                yAxisLabel=""
                chartConfig={{
                    backgroundColor: '#ff8c00',
                    backgroundGradientFrom: '#ff8c00',
                    backgroundGradientTo: '#ff8c00',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                style={styles.chart}
            />

            <LineChart
                data={chartData}
                width={350}
                height={220}
                yAxisLabel=""
                chartConfig={{
                    backgroundColor: '#ff8c00',
                    backgroundGradientFrom: '#ff8c00',
                    backgroundGradientTo: '#ff8c00',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                style={styles.chart}
            />
            {/* Boton calibracion */}
            <TouchableOpacity style={styles.button} onPress={handleCalibration}>
                <Text style={styles.buttonText}>Realizar prueba de calibración</Text>
            </TouchableOpacity>

            <CustomBottomBar />
        </BackgroundWrapper>
    );
}

const styles = StyleSheet.create({
    chart: { marginVertical: 10, borderRadius: 10 },
    container: {
        flex: 1,
        backgroundColor: '#FFA500',
        padding: 20,
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
    },
    graphPlaceholder: {
        backgroundColor: '#ffffffaa',
        height: 150,
        borderRadius: 10,
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    graphText: {
        color: '#666',
        fontStyle: 'italic',
    },
    button: {
        backgroundColor: '#000',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#3E3E3E',
        paddingVertical: 12,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginTop: 20,
    },
    navItem: {
        color: '#fff',
        fontSize: 14,
    },
});
