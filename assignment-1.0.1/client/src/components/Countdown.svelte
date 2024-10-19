<script>
    import {onDestroy, onMount} from "svelte";
    import {getRemainingTime} from "../utils/timeUtils.js";

    export let endDate;
    let countdown = '';
    let isAuctionEnded = false;
    let interval;

    //Update countdown every second
    function startCountdown() {
        const updateCountdown = () => {
            const remainingTime = getRemainingTime(endDate);
            if (remainingTime.total <= 0) {
                clearInterval(interval);
                isAuctionEnded = true;
                countdown = 'Auction ended';
            } else {
                countdown = `${remainingTime.days}d ${remainingTime.hours}h ${remainingTime.minutes}m ${remainingTime.seconds}s`;
            }
        };

        updateCountdown();
        interval = setInterval(updateCountdown, 1000);  // Update every second
    }

    //Cleanup the interval when the component is destroyed
    onDestroy(() => {
        if (interval) {
            clearInterval(interval);
        }
    });

    onMount(() => {
        startCountdown();
    });
</script>

<p>
    <strong>Countdown:</strong> {countdown}
</p>

<style>
    p {
        font-size: 14px;
        color: #2c3e50;
    }

    p strong {
        font-weight: bold;
        color: #34495e;
    }
</style>