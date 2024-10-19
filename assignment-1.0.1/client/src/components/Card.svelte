<script>
    import Countdown from "./Countdown.svelte";

    export let auction;
</script>

<article class="pokemon-card">
    <header>
        <h3>{auction.attributes.pokemon} - {auction.attributes.set} (Grade: {auction.attributes.grade})</h3>
    </header>

    <figure>
        <img src={auction.attributes.image} alt={`${auction.attributes.pokemon} image`} />
    </figure>

    <section>
        <p><strong>Year:</strong> {auction.attributes.year}</p>
        <p><strong>Grading Company:</strong> {auction.attributes.gradingCompany}</p>
        <p><strong>Holo:</strong> {auction.attributes.holo}</p>
        <p><strong>Price:</strong> ${auction.currentPrice}</p>
        <Countdown endDate={auction.endDate} />
    </section>

    <footer>
        <a href={`/auctions/${auction.id}`}>View Details</a>
    </footer>
</article>

<style>
    .pokemon-card {
        border: 1px solid #e0e0e0;
        padding: 20px;
        border-radius: 10px;
        transition: box-shadow 0.3s ease, transform 0.3s ease;
        background: #fdfdfd;
        width: 265px;
        text-align: center;
    }

    .pokemon-card:hover {
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        transform: translateY(-5px);
    }

    .pokemon-card img {
        width: 100%;
        max-width: 200px;
        max-height: 225px;
        border-radius: 8px;
        object-fit: contain;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        margin-bottom: 15px;
    }

    .pokemon-card h3 {
        font-size: 17px;
        margin: 10px 0;
        color: #34495e;
        font-weight: 600;
    }

    .pokemon-card p {
        margin: 5px 0;
        font-size: 14px;
        color: #7f8c8d;
    }

    .pokemon-card p strong {
        color: #2c3e50;
    }

    .pokemon-card a {
        display: inline-block;
        text-decoration: none;
        color: #ffffff;
        background-color: #3498db;
        padding: 8px 16px;
        border-radius: 5px;
        font-weight: 500;
        margin-top: 10px;
        transition: background-color 0.3s ease;
    }

    .pokemon-card a:hover {
        background-color: #2980b9;
    }

    header, section, footer {
        margin-bottom: 10px;
    }

    footer {
        display: flex;
        justify-content: center;
    }
</style>