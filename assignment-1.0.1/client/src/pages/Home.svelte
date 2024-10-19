<script>
    import Card from '../components/Card.svelte'; // Card component to display auction details
    import Filter from '../components/Filter.svelte'; // Filter component to handle filtering options
    import {onMount} from "svelte";

    let auctions = [];
    let filters = {
        pokemon: '',
        set: '',
        gradingCompany: '',
        grade: '',
        status: '',
        maxPrice: '',
    }

    let sortOption = 'endDate';
    let limit = 10;

    async function fetchAuctions() {
        const query = new URLSearchParams({
            name: filters.pokemon,
            set: filters.set,
            gradingCompany: filters.gradingCompany,
            grade: filters.grade,
            status: filters.status,
            maxPrice: filters.maxPrice,
            sort: sortOption,
            limit: String(limit)
        }).toString();

        const response = await fetch(`http://localhost:3000/api/auctions?${query}`);
        const data = await response.json();
        if (response.ok) {
            auctions = data;
        } else {
            console.error("Failed to fetch auctions:", data.message);
        }
    }

    onMount(fetchAuctions);

    function handleFilterChange(newFilters) {
        filters = { ...filters, ...newFilters.detail };
        fetchAuctions(); //Refetch auctions with updated filters
    }

    function handleSortChange(newSortOption) {
        sortOption = newSortOption.detail;
        fetchAuctions(); //Refetch auctions with updated sorting
    }

    function handleLimitChange(newLimit) {
        limit = newLimit.detail;
        fetchAuctions(); //Refetch auctions with updated limit
    }
</script>

<Filter
        on:filterChange={handleFilterChange}
        on:sortChange={handleSortChange}
        on:limitChange={handleLimitChange}
/>

<div class="auction-list">
    {#if auctions.length > 0}
        {#each auctions as auction}
            <Card {auction} />
        {/each}
    {:else}
        <p>No auctions match the current filter criteria.</p>
    {/if}
</div>

<style>
    .auction-list {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
    }
</style>