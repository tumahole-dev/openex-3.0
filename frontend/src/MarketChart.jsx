import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip,
} from "chart.js";
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

export default function MarketChart({ symbol }) {
    const [ticks, setTicks] = useState([]);

    useEffect(() => {
        const symbolPath = symbol.replace("/", "-");
        const poll = () => {
            axios.get(`http://localhost:5000/api/market/${symbolPath}`)
                .then(({ data }) => setTicks(data.ticks))
                .catch(() => {});
        };
        poll();
        const interval = setInterval(poll, 2000); // refresh every 2 seconds
        return () => clearInterval(interval);
    }, [symbol]);

    const data = {
        labels: ticks.map((_, i) => i),
        datasets: [{
            label: symbol,
            data: ticks.map((t) => t.price),
            borderColor: "#37c26d",
            pointRadius: 0,
            tension: 0.2,
        }],
    };

    return (
        <div>
            <h3>Price Chart — {symbol}</h3>
            <Line data={data} options={{ animation: false, scales: { x: { display: false } } }} />
        </div>
    );
}