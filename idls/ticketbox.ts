export type Ticketbox = {
  "version": "0.1.0",
  "name": "ticketbox",
  "instructions": [
    {
      "name": "initializeConfig",
      "accounts": [
        {
          "name": "config",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "transferAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ticketTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "currencyMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ticketTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "makerVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "devVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "funder",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "authority",
          "type": "publicKey"
        },
        {
          "name": "ticketPrice",
          "type": "u64"
        },
        {
          "name": "makerPercent",
          "type": "u16"
        },
        {
          "name": "devPercent",
          "type": "u16"
        }
      ]
    },
    {
      "name": "updateAuthority",
      "accounts": [
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "newAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updateTicketPrice",
      "accounts": [
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "ticketPrice",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateMakerVault",
      "accounts": [
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "makerVault",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updateDevVault",
      "accounts": [
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "devVault",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "depositTicketToken",
      "accounts": [
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ticketTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ticketTokenFromVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "funder",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdrawTicketToken",
      "accounts": [
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ticketTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ticketTokenToVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updatePercents",
      "accounts": [
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "makerPercent",
          "type": "u16"
        },
        {
          "name": "devPercent",
          "type": "u16"
        }
      ]
    },
    {
      "name": "buyTicket",
      "accounts": [
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ticketTokenUserVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "currencyUserVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ticketTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "makerVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "devVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "funder",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ],
      "returns": "u64"
    }
  ],
  "accounts": [
    {
      "name": "ticketboxConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "ticketTokenMint",
            "type": "publicKey"
          },
          {
            "name": "ticketTokenVault",
            "type": "publicKey"
          },
          {
            "name": "currencyMint",
            "type": "publicKey"
          },
          {
            "name": "ticketPrice",
            "type": "u64"
          },
          {
            "name": "makerVault",
            "type": "publicKey"
          },
          {
            "name": "makerPercent",
            "type": "u16"
          },
          {
            "name": "devVault",
            "type": "publicKey"
          },
          {
            "name": "devPercent",
            "type": "u16"
          },
          {
            "name": "transferAuthorityBump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "EventHeader",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "signer",
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "config",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "InitializeConfigEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "EventHeader"
          },
          "index": false
        },
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "ticketTokenMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "ticketTokenVault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "currencyMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "ticketPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "makerVault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "makerPercent",
          "type": "u16",
          "index": false
        },
        {
          "name": "devVault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "devPercent",
          "type": "u16",
          "index": false
        }
      ]
    },
    {
      "name": "UpdateAuthorityEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "EventHeader"
          },
          "index": false
        },
        {
          "name": "oldAuthority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "newAuthority",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "UpdateMakerVaultEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "EventHeader"
          },
          "index": false
        },
        {
          "name": "oldMakerVault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "newMakerVault",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "UpdateDevVaultEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "EventHeader"
          },
          "index": false
        },
        {
          "name": "oldDevVault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "newDevVault",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "UpdateTicketPriceEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "EventHeader"
          },
          "index": false
        },
        {
          "name": "oldTicketPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "newTicketPrice",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "UpdatePercentsEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "EventHeader"
          },
          "index": false
        },
        {
          "name": "oldMakerPercent",
          "type": "u16",
          "index": false
        },
        {
          "name": "oldDevPercent",
          "type": "u16",
          "index": false
        },
        {
          "name": "newMakerPercent",
          "type": "u16",
          "index": false
        },
        {
          "name": "newDevPercent",
          "type": "u16",
          "index": false
        }
      ]
    },
    {
      "name": "DepositTicketTokenEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "EventHeader"
          },
          "index": false
        },
        {
          "name": "funder",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "WithdrawTicketTokenEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "EventHeader"
          },
          "index": false
        },
        {
          "name": "ticketTokenToVault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "BuyTicketEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "EventHeader"
          },
          "index": false
        },
        {
          "name": "funder",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "ticketTokenUserVault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "ticketAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "totalCurrency",
          "type": "u64",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "TooSmallTicketPrice",
      "msg": "TooSmallTicketPrice"
    },
    {
      "code": 6001,
      "name": "BadPercents",
      "msg": "BadPercents"
    },
    {
      "code": 6002,
      "name": "AddOverflow",
      "msg": "AddOverflow"
    },
    {
      "code": 6003,
      "name": "SubOverflow",
      "msg": "SubOverflow"
    },
    {
      "code": 6004,
      "name": "MulOverflow",
      "msg": "MulOverflow"
    },
    {
      "code": 6005,
      "name": "DivByZero",
      "msg": "DivByZero"
    }
  ]
};

export const IDL: Ticketbox = {
  "version": "0.1.0",
  "name": "ticketbox",
  "instructions": [
    {
      "name": "initializeConfig",
      "accounts": [
        {
          "name": "config",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "transferAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ticketTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "currencyMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ticketTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "makerVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "devVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "funder",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "authority",
          "type": "publicKey"
        },
        {
          "name": "ticketPrice",
          "type": "u64"
        },
        {
          "name": "makerPercent",
          "type": "u16"
        },
        {
          "name": "devPercent",
          "type": "u16"
        }
      ]
    },
    {
      "name": "updateAuthority",
      "accounts": [
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "newAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updateTicketPrice",
      "accounts": [
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "ticketPrice",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateMakerVault",
      "accounts": [
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "makerVault",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updateDevVault",
      "accounts": [
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "devVault",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "depositTicketToken",
      "accounts": [
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ticketTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ticketTokenFromVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "funder",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdrawTicketToken",
      "accounts": [
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ticketTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ticketTokenToVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updatePercents",
      "accounts": [
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "makerPercent",
          "type": "u16"
        },
        {
          "name": "devPercent",
          "type": "u16"
        }
      ]
    },
    {
      "name": "buyTicket",
      "accounts": [
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ticketTokenUserVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "currencyUserVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ticketTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "makerVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "devVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "funder",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ],
      "returns": "u64"
    }
  ],
  "accounts": [
    {
      "name": "ticketboxConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "ticketTokenMint",
            "type": "publicKey"
          },
          {
            "name": "ticketTokenVault",
            "type": "publicKey"
          },
          {
            "name": "currencyMint",
            "type": "publicKey"
          },
          {
            "name": "ticketPrice",
            "type": "u64"
          },
          {
            "name": "makerVault",
            "type": "publicKey"
          },
          {
            "name": "makerPercent",
            "type": "u16"
          },
          {
            "name": "devVault",
            "type": "publicKey"
          },
          {
            "name": "devPercent",
            "type": "u16"
          },
          {
            "name": "transferAuthorityBump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "EventHeader",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "signer",
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "config",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "InitializeConfigEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "EventHeader"
          },
          "index": false
        },
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "ticketTokenMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "ticketTokenVault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "currencyMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "ticketPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "makerVault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "makerPercent",
          "type": "u16",
          "index": false
        },
        {
          "name": "devVault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "devPercent",
          "type": "u16",
          "index": false
        }
      ]
    },
    {
      "name": "UpdateAuthorityEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "EventHeader"
          },
          "index": false
        },
        {
          "name": "oldAuthority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "newAuthority",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "UpdateMakerVaultEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "EventHeader"
          },
          "index": false
        },
        {
          "name": "oldMakerVault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "newMakerVault",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "UpdateDevVaultEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "EventHeader"
          },
          "index": false
        },
        {
          "name": "oldDevVault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "newDevVault",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "UpdateTicketPriceEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "EventHeader"
          },
          "index": false
        },
        {
          "name": "oldTicketPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "newTicketPrice",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "UpdatePercentsEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "EventHeader"
          },
          "index": false
        },
        {
          "name": "oldMakerPercent",
          "type": "u16",
          "index": false
        },
        {
          "name": "oldDevPercent",
          "type": "u16",
          "index": false
        },
        {
          "name": "newMakerPercent",
          "type": "u16",
          "index": false
        },
        {
          "name": "newDevPercent",
          "type": "u16",
          "index": false
        }
      ]
    },
    {
      "name": "DepositTicketTokenEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "EventHeader"
          },
          "index": false
        },
        {
          "name": "funder",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "WithdrawTicketTokenEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "EventHeader"
          },
          "index": false
        },
        {
          "name": "ticketTokenToVault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "BuyTicketEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "EventHeader"
          },
          "index": false
        },
        {
          "name": "funder",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "ticketTokenUserVault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "ticketAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "totalCurrency",
          "type": "u64",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "TooSmallTicketPrice",
      "msg": "TooSmallTicketPrice"
    },
    {
      "code": 6001,
      "name": "BadPercents",
      "msg": "BadPercents"
    },
    {
      "code": 6002,
      "name": "AddOverflow",
      "msg": "AddOverflow"
    },
    {
      "code": 6003,
      "name": "SubOverflow",
      "msg": "SubOverflow"
    },
    {
      "code": 6004,
      "name": "MulOverflow",
      "msg": "MulOverflow"
    },
    {
      "code": 6005,
      "name": "DivByZero",
      "msg": "DivByZero"
    }
  ]
};
