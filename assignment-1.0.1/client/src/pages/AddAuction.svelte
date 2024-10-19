<script>
    import AuctionForm from '../components/AuctionForm.svelte';
    import { validateAuction } from '../utils/validation.js';
    import { authStore } from '../stores/authStore.js';

    let successMessage = '';
    let errorMessage = '';

    authStore.subscribe(state => {
        if (!state.user || !state.user.roles.includes('admin')) {
            errorMessage = 'You do not have permission to add auctions.';
            window.location.href = '/';
        }
    });

    async function handleAddAuction(auction) {
        const { valid, message } = validateAuction(auction);
        if (!valid) {
            errorMessage = message;
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/auctions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    name: auction.name,
                    attributes: { pokemon: auction.name, set: auction.set, year: auction.year, gradingCompany: auction.gradingCompany, grade: auction.grade, holo: auction.holo, image: auction.imageURL, description: auction.description },
                    currentPrice: auction.price,
                    endDate: auction.endDate
                })
            });
            const data = await response.json();
            if (response.ok) {
                successMessage = 'Auction added successfully!';
                window.location.href = '/';
            } else {
                errorMessage = data.message;
            }
        } catch (err) {
            errorMessage = 'Failed to add auction.';
        }
    }
</script>

<AuctionForm buttonText="Add" onSubmit={handleAddAuction} />

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