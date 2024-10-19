<script>
    export let name = '';
    export let set = '';
    export let year = 0;
    export let gradingCompany = '';
    export let grade = 7;
    export let holo = '';
    export let price = 0;
    export let imageURL = '';
    export let description = '';
    export let endDate = '';
    export let buttonText = 'Submit';
    export let onSubmit;

    function handleSubmit(event) {
        event.preventDefault(); //Prevent the default form submission behavior
        onSubmit({ name, set, year, gradingCompany, grade, holo, price, imageURL, description, endDate });
    }
</script>

<div class="form-container">
    <h1>{buttonText} Auction</h1>
    <div>
        <label for="name">Pokemon Name</label>
        <input type="text" bind:value={name} id="name" required />

        <label for="set">Set</label>
        <input type="text" bind:value={set} id="set" required />

        <label for="year">Year</label>
        <input type="number" bind:value={year} id="year" required min="1995" />

        <label for="gradingCompany">Grading Company</label>
        <select bind:value={gradingCompany} id="gradingCompany" required>
            <option value="PSA">PSA</option>
            <option value="Beckett">Beckett</option>
        </select>

        <label for="grade">Grade (7+)</label>
        <input type="number" bind:value={grade} id="grade" min="7" required />

        <label for="holo">Holo</label>
        <select bind:value={holo} id="holo" required>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
        </select>

        <label for="description">Description</label>
        <input type="text" bind:value={description} id="description" required />

        <label for="imageURL">Image URL</label>
        <input type="url" bind:value={imageURL} id="imageURL" required />

        <label for="price">Starting Price</label>
        <input type="number" bind:value={price} id="price" required min="1" />

        <label for="endDate">End Date</label>
        <input type="datetime-local" bind:value={endDate} id="endDate" required />

        <button on:click={handleSubmit}>{buttonText}</button>
    </div>
</div>

<style>
    .form-container {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 10px;
        background-color: #fdfdfd;
    }

    .form-container label {
        display: block;
        margin-bottom: 8px;
        font-weight: bold;
    }

    .form-container input,
    .form-container select {
        width: 100%;
        padding: 12px;
        margin-bottom: 15px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 16px;
        box-sizing: border-box;
    }

    .form-container button {
        width: 100%;
        padding: 12px;
        background-color: #3498db;
        color: white;
        font-size: 16px;
        font-weight: 600;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .form-container button:hover {
        background-color: #2980b9;
    }
</style>