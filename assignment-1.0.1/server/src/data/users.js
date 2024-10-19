const users = [
    {
        id: 1,
        username: "admin",
        passwordHash: "$2a$10$JlgcCLVySxPI6Wwtjq.0cOE8ml9fC.92Xi9oQ/ufZ95T6cysUhX5i", //Password for admin is admin123
        roles: ["admin"],
        wonAuctions:[]
    },
    {
        id: 2,
        username: "user",
        passwordHash: "$2a$10$sP0g6FGMtal0OHcQNSpIBeVjVcVjONCL/TM5LZ9xTuOXDjXFt33Hi", //Password for user is password
        roles: ["bidder"],
        wonAuctions:[{ auctionId: 1, price: 5000, wonAt: '2024-10-16T00:04:23.292Z' },
            { auctionId: 2, price: 5000, wonAt: '2024-10-16T00:04:23.292Z' }
        ]
    },
    {
        //Ignore this user
        id: 3,
        username: "bercanovic",
        passwordHash: "$2a$10$sP0g6FGMtal0OHcQNSpIBeVjVcVjONCL/TM5LZ9xTuOXDjXFt33Hi", //Password for user is password
        roles: ["bidder", "admin"],
        wonAuctions:[]
    }
];

export default users;