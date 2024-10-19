<script>
    import {onMount} from 'svelte';
    import AuctionForm from '../components/AuctionForm.svelte';
    import {validateAuction} from '../utils/validation.js';
    import {authStore} from '../stores/authStore.js';

    export let id;  //AuctionID from route

    let auction = null;
    let successMessage = '';
    let errorMessage = '';

    authStore.subscribe(state => {
        if (!state.user || !state.user.roles.includes('admin')) {
            errorMessage = 'You do not have permission to edit auctions.';
            window.location.href = '/';
        }
    });

    async function fetchAuctionDetails() { //Fetch auction details by ID
        try {
            const response = await fetch(`http://localhost:3000/api/auctions/${id}`);
            const data = await response.json();
            if (response.ok) {
                auction = data;
            } else {
                errorMessage = 'Failed to load auction details.';
            }
        } catch (err) {
            errorMessage = 'Error fetching auction details.';
        }
    }

    onMount(fetchAuctionDetails)


    async function handleUpdateAuction(updatedAuction) { //Handle form submission for updating auction
        const {valid, message} = validateAuction(updatedAuction);
        if (!valid) {
            errorMessage = message;
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/auctions/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    name: updatedAuction.name,
                    attributes: {
                        pokemon: updatedAuction.name,
                        set: updatedAuction.set,
                        year: updatedAuction.year,
                        gradingCompany: updatedAuction.gradingCompany,
                        grade: updatedAuction.grade,
                        holo: updatedAuction.holo,
                        image: updatedAuction.imageURL,
                        description: updatedAuction.description
                    },
                    currentPrice: updatedAuction.price,
                    endDate: updatedAuction.endDate
                })
            });

            const data = await response.json();
            if (response.ok) {
                successMessage = 'Auction updated successfully!';
                window.location.href = '/';
            } else {
                errorMessage = data.message;
            }
        } catch (err) {
            errorMessage = 'Failed to update auction.';
        }
    }
</script>

{#if auction}
    <AuctionForm
            buttonText="Update"
            name={auction.attributes.pokemon}
            set={auction.attributes.set}
            year={auction.attributes.year}
            gradingCompany={auction.attributes.gradingCompany}
            grade={auction.attributes.grade}
            holo={auction.attributes.holo}
            price={auction.currentPrice}
            imageURL={auction.attributes.image}
            description={auction.attributes.description}
            endDate={new Date(auction.endDate).toISOString().slice(0, 16)}
            onSubmit={handleUpdateAuction}
    />
{:else}
    <p>Loading auction details...</p>
{/if}

{#if successMessage}
    <p class="success">{successMessage}</p>
{/if}

{#if errorMessage}
    <p class="error">{errorMessage}</p>
{/if}

<style>
    .error {
        color: red;
    }

    .success {
        color: green;
    }
</style>