import React from 'react';
import Plot from 'react-plotly.js';

const BarChart = ({ data, layout, config }) => {
    return (
        <Plot
            data={[
                {
                    x: data.x,
                    y: data.y,
                    type: 'bar',
                    marker: { color: data.color || 'blue' },
                },
            ]}
            layout={{
                width: 720,
                height: 440,
                title: layout.title,
                xaxis: { title: layout.xAxisLabel },
                yaxis: { title: layout.yAxisLabel },
                ...layout,
            }}
            config={config}
        />
    );
};

export default BarChart;