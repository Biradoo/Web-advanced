<script>
    import {createEventDispatcher} from "svelte";

    export let filters = {
        pokemon: '',
        set: '',
        gradingCompany: '',
        grade: '',
        status: '',
        maxPrice: ''
    };

    const dispatch = createEventDispatcher();

    function handleFilterChange(event) { //For filtering
        const { name, value } = event.target;
        const updatedFilters = { ...filters, [name]: value };
        dispatch("filterChange", updatedFilters);
    }

    function handleSortChange(event) { //For sorting
        const newSortOption = event.target.value;
        dispatch("sortChange", newSortOption);
    }

    function handleLimitChange(event) { //For limitting search results
        const newLimit = event.target.value;
        dispatch("limitChange", newLimit);
    }
</script>

<div class="filters">

    <input type="text" name="pokemon" placeholder="Search by Name" on:input={handleFilterChange} value={filters.pokemon} />

    <input type="text" name="set" placeholder="Search by Set" on:input={handleFilterChange} value={filters.set} />

    <select name="gradingCompany" on:change={handleFilterChange} bind:value={filters.gradingCompany}>
        <option value="">All Grading Companies</option>
        <option value="PSA">PSA</option>
        <option value="Beckett">Beckett</option>
    </select>

    <select name="grade" on:change={handleFilterChange} bind:value={filters.grade}>
        <option value="">All Grades</option>
        <option value="10">10</option>
        <option value="9">9</option>
        <option value="8">8</option>
        <option value="7">7</option>
    </select>

    <select name="status" on:change={handleFilterChange} bind:value={filters.status}>
        <option value="">All Statuses</option>
        <option value="ongoing">Ongoing</option>
        <option value="ended">Ended</option>
    </select>

    <input type="number" name="maxPrice" placeholder="Max Price" on:input={handleFilterChange} value={filters.maxPrice} />

    <select name="sortOption" on:change={handleSortChange}>
        <option value="endDate">Sort by Ending Date</option>
        <option value="price">Sort by Price</option>
        <option value="alphabetical">Sort Alphabetically</option>
    </select>

    <select name="limit" on:change={handleLimitChange} >
        <option value=100>No limit</option>
        <option value=15>Limit: 15</option>
        <option value=10>Limit: 10</option>
        <option value=5>Limit: 5</option>
    </select>
</div>

<style>
    .filters {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 20px;
        margin-top: 15px;
        width: 94%;
    }

    .filters input, .filters select {
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        flex-grow: 1;
    }

    .filters select {
        max-width: 200px;
    }

</style>