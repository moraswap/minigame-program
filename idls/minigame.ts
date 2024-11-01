export type Minigame = {
  "version": "0.1.0",
  "name": "minigame",
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
          "name": "ticketTokenVault",
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
          "name": "operator",
          "type": "publicKey"
        },
        {
          "name": "ticketTokenAmount",
          "type": "u64"
        },
        {
          "name": "feeRate",
          "type": "u16"
        },
        {
          "name": "lockTime",
          "type": "u64"
        },
        {
          "name": "matchTime",
          "type": "u64"
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
      "name": "updateOperator",
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
          "name": "newOperator",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "pauseOrResume",
      "accounts": [
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "updateTicketTokenAmount",
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
          "name": "ticketTokenAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateFeeRate",
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
          "name": "feeRate",
          "type": "u16"
        }
      ]
    },
    {
      "name": "updateLockedTokenAmount",
      "accounts": [
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
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
          "name": "lockedTokenAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateLockTime",
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
          "name": "lockTime",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateRewardTokenAmount",
      "accounts": [
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
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
          "name": "rewardTokenAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateMatchTime",
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
          "name": "matchTime",
          "type": "u64"
        }
      ]
    },
    {
      "name": "depositRewardToken",
      "accounts": [
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rewardTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardTokenFromVault",
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
      "name": "withdrawRewardToken",
      "accounts": [
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
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
          "name": "rewardTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardTokenToVault",
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
      "name": "createPool",
      "accounts": [
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lockedTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rewardTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
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
      "args": []
    },
    {
      "name": "initializePool",
      "accounts": [
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lockedTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rewardTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lockedTokenVault",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "rewardTokenVault",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
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
          "name": "lockedTokenAmount",
          "type": "u64"
        },
        {
          "name": "rewardTokenAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "play",
      "accounts": [
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "playmatch",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "matchMint",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "ticketTokenUserVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lockedTokenUserVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ticketTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lockedTokenVault",
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
      "args": []
    },
    {
      "name": "fulfill",
      "accounts": [
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "operator",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "playmatch",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ticketTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ticketTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lockedTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ticketTokenUserVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lockedTokenUserVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardTokenUserVault",
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
          "name": "isWin",
          "type": "bool"
        }
      ]
    },
    {
      "name": "unlock",
      "accounts": [
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "operator",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "playmatch",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lockedTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lockedTokenUserVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "gameConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "operator",
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
            "name": "ticketTokenAmount",
            "type": "u64"
          },
          {
            "name": "feeRate",
            "type": "u16"
          },
          {
            "name": "lockTime",
            "type": "u64"
          },
          {
            "name": "matchTime",
            "type": "u64"
          },
          {
            "name": "transferAuthorityBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "playMatch",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "config",
            "type": "publicKey"
          },
          {
            "name": "pool",
            "type": "publicKey"
          },
          {
            "name": "matchMint",
            "type": "publicKey"
          },
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "ticketTokenMint",
            "type": "publicKey"
          },
          {
            "name": "ticketTokenAmount",
            "type": "u64"
          },
          {
            "name": "lockedTokenMint",
            "type": "publicKey"
          },
          {
            "name": "lockedTokenAmount",
            "type": "u64"
          },
          {
            "name": "rewardTokenMint",
            "type": "publicKey"
          },
          {
            "name": "rewardTokenAmount",
            "type": "u64"
          },
          {
            "name": "endTime",
            "type": "u64"
          },
          {
            "name": "isWin",
            "type": "bool"
          },
          {
            "name": "isFulfilled",
            "type": "bool"
          },
          {
            "name": "unlockTime",
            "type": "u64"
          },
          {
            "name": "isUnlocked",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "pool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "config",
            "type": "publicKey"
          },
          {
            "name": "isPause",
            "type": "bool"
          },
          {
            "name": "lockedTokenMint",
            "type": "publicKey"
          },
          {
            "name": "lockedTokenVault",
            "type": "publicKey"
          },
          {
            "name": "lockedTokenAmount",
            "type": "u64"
          },
          {
            "name": "rewardTokenMint",
            "type": "publicKey"
          },
          {
            "name": "rewardTokenVault",
            "type": "publicKey"
          },
          {
            "name": "rewardTokenAmount",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "ConfigEventHeader",
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
    },
    {
      "name": "PoolEventHeader",
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
            "name": "pool",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "MatchEventHeader",
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
          },
          {
            "name": "pool",
            "type": "publicKey"
          },
          {
            "name": "playmatch",
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
            "defined": "ConfigEventHeader"
          },
          "index": false
        },
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "operator",
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
          "name": "ticketTokenAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeRate",
          "type": "u16",
          "index": false
        },
        {
          "name": "lockTime",
          "type": "u64",
          "index": false
        },
        {
          "name": "matchTime",
          "type": "u64",
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
            "defined": "ConfigEventHeader"
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
      "name": "UpdateOperatorEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "ConfigEventHeader"
          },
          "index": false
        },
        {
          "name": "oldOperator",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "newOperator",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "CreatePoolEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "PoolEventHeader"
          },
          "index": false
        },
        {
          "name": "lockedTokenMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "rewardTokenMint",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "InitializePoolEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "PoolEventHeader"
          },
          "index": false
        },
        {
          "name": "lockedTokenVault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "lockedTokenAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "rewardTokenVault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "rewardTokenAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "UpdateFeeRateEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "ConfigEventHeader"
          },
          "index": false
        },
        {
          "name": "oldFeeRate",
          "type": "u16",
          "index": false
        },
        {
          "name": "newFeeRate",
          "type": "u16",
          "index": false
        }
      ]
    },
    {
      "name": "UpdateLockTimeEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "ConfigEventHeader"
          },
          "index": false
        },
        {
          "name": "oldLockTime",
          "type": "u64",
          "index": false
        },
        {
          "name": "newLockTime",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "UpdateMatchTimeEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "ConfigEventHeader"
          },
          "index": false
        },
        {
          "name": "oldMatchTime",
          "type": "u64",
          "index": false
        },
        {
          "name": "newMatchTime",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "UpdateTicketTokenAmountEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "ConfigEventHeader"
          },
          "index": false
        },
        {
          "name": "oldTicketTokenAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "newTicketTokenAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "UpdateLockedTokenAmountEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "PoolEventHeader"
          },
          "index": false
        },
        {
          "name": "oldLockedTokenAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "newLockedTokenAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "UpdateRewardTokenAmountEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "PoolEventHeader"
          },
          "index": false
        },
        {
          "name": "oldRewardTokenAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "newRewardTokenAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "PauseEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "PoolEventHeader"
          },
          "index": false
        }
      ]
    },
    {
      "name": "ResumeEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "PoolEventHeader"
          },
          "index": false
        }
      ]
    },
    {
      "name": "DepositRewardTokenEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "PoolEventHeader"
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
      "name": "WithdrawRewardTokenEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "PoolEventHeader"
          },
          "index": false
        },
        {
          "name": "rewardTokenToVault",
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
      "name": "PlayEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "MatchEventHeader"
          },
          "index": false
        },
        {
          "name": "funder",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "matchMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "ticketTokenAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "lockedTokenAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "rewardTokenAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "FulfillEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "MatchEventHeader"
          },
          "index": false
        },
        {
          "name": "isWin",
          "type": "bool",
          "index": false
        }
      ]
    },
    {
      "name": "UnlockEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "MatchEventHeader"
          },
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "FeeRateMaxExceeded",
      "msg": "FeeRateMaxExceeded"
    },
    {
      "code": 6001,
      "name": "Paused",
      "msg": "Paused"
    },
    {
      "code": 6002,
      "name": "TooEarly",
      "msg": "TooEarly"
    },
    {
      "code": 6003,
      "name": "Fulfilled",
      "msg": "Fulfilled"
    },
    {
      "code": 6004,
      "name": "Unlocked",
      "msg": "Unlocked"
    },
    {
      "code": 6005,
      "name": "CannotUnlock",
      "msg": "CannotUnlock"
    },
    {
      "code": 6006,
      "name": "AddOverflow",
      "msg": "AddOverflow"
    },
    {
      "code": 6007,
      "name": "SubOverflow",
      "msg": "SubOverflow"
    },
    {
      "code": 6008,
      "name": "MulOverflow",
      "msg": "MulOverflow"
    },
    {
      "code": 6009,
      "name": "DivByZero",
      "msg": "DivByZero"
    }
  ]
};

export const IDL: Minigame = {
  "version": "0.1.0",
  "name": "minigame",
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
          "name": "ticketTokenVault",
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
          "name": "operator",
          "type": "publicKey"
        },
        {
          "name": "ticketTokenAmount",
          "type": "u64"
        },
        {
          "name": "feeRate",
          "type": "u16"
        },
        {
          "name": "lockTime",
          "type": "u64"
        },
        {
          "name": "matchTime",
          "type": "u64"
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
      "name": "updateOperator",
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
          "name": "newOperator",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "pauseOrResume",
      "accounts": [
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "updateTicketTokenAmount",
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
          "name": "ticketTokenAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateFeeRate",
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
          "name": "feeRate",
          "type": "u16"
        }
      ]
    },
    {
      "name": "updateLockedTokenAmount",
      "accounts": [
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
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
          "name": "lockedTokenAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateLockTime",
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
          "name": "lockTime",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateRewardTokenAmount",
      "accounts": [
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
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
          "name": "rewardTokenAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateMatchTime",
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
          "name": "matchTime",
          "type": "u64"
        }
      ]
    },
    {
      "name": "depositRewardToken",
      "accounts": [
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rewardTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardTokenFromVault",
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
      "name": "withdrawRewardToken",
      "accounts": [
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
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
          "name": "rewardTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardTokenToVault",
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
      "name": "createPool",
      "accounts": [
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lockedTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rewardTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
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
      "args": []
    },
    {
      "name": "initializePool",
      "accounts": [
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lockedTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rewardTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lockedTokenVault",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "rewardTokenVault",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
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
          "name": "lockedTokenAmount",
          "type": "u64"
        },
        {
          "name": "rewardTokenAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "play",
      "accounts": [
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "playmatch",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "matchMint",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "ticketTokenUserVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lockedTokenUserVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ticketTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lockedTokenVault",
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
      "args": []
    },
    {
      "name": "fulfill",
      "accounts": [
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "operator",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "playmatch",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ticketTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ticketTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lockedTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ticketTokenUserVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lockedTokenUserVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardTokenUserVault",
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
          "name": "isWin",
          "type": "bool"
        }
      ]
    },
    {
      "name": "unlock",
      "accounts": [
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "operator",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "playmatch",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lockedTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lockedTokenUserVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "gameConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "operator",
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
            "name": "ticketTokenAmount",
            "type": "u64"
          },
          {
            "name": "feeRate",
            "type": "u16"
          },
          {
            "name": "lockTime",
            "type": "u64"
          },
          {
            "name": "matchTime",
            "type": "u64"
          },
          {
            "name": "transferAuthorityBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "playMatch",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "config",
            "type": "publicKey"
          },
          {
            "name": "pool",
            "type": "publicKey"
          },
          {
            "name": "matchMint",
            "type": "publicKey"
          },
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "ticketTokenMint",
            "type": "publicKey"
          },
          {
            "name": "ticketTokenAmount",
            "type": "u64"
          },
          {
            "name": "lockedTokenMint",
            "type": "publicKey"
          },
          {
            "name": "lockedTokenAmount",
            "type": "u64"
          },
          {
            "name": "rewardTokenMint",
            "type": "publicKey"
          },
          {
            "name": "rewardTokenAmount",
            "type": "u64"
          },
          {
            "name": "endTime",
            "type": "u64"
          },
          {
            "name": "isWin",
            "type": "bool"
          },
          {
            "name": "isFulfilled",
            "type": "bool"
          },
          {
            "name": "unlockTime",
            "type": "u64"
          },
          {
            "name": "isUnlocked",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "pool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "config",
            "type": "publicKey"
          },
          {
            "name": "isPause",
            "type": "bool"
          },
          {
            "name": "lockedTokenMint",
            "type": "publicKey"
          },
          {
            "name": "lockedTokenVault",
            "type": "publicKey"
          },
          {
            "name": "lockedTokenAmount",
            "type": "u64"
          },
          {
            "name": "rewardTokenMint",
            "type": "publicKey"
          },
          {
            "name": "rewardTokenVault",
            "type": "publicKey"
          },
          {
            "name": "rewardTokenAmount",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "ConfigEventHeader",
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
    },
    {
      "name": "PoolEventHeader",
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
            "name": "pool",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "MatchEventHeader",
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
          },
          {
            "name": "pool",
            "type": "publicKey"
          },
          {
            "name": "playmatch",
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
            "defined": "ConfigEventHeader"
          },
          "index": false
        },
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "operator",
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
          "name": "ticketTokenAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeRate",
          "type": "u16",
          "index": false
        },
        {
          "name": "lockTime",
          "type": "u64",
          "index": false
        },
        {
          "name": "matchTime",
          "type": "u64",
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
            "defined": "ConfigEventHeader"
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
      "name": "UpdateOperatorEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "ConfigEventHeader"
          },
          "index": false
        },
        {
          "name": "oldOperator",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "newOperator",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "CreatePoolEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "PoolEventHeader"
          },
          "index": false
        },
        {
          "name": "lockedTokenMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "rewardTokenMint",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "InitializePoolEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "PoolEventHeader"
          },
          "index": false
        },
        {
          "name": "lockedTokenVault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "lockedTokenAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "rewardTokenVault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "rewardTokenAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "UpdateFeeRateEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "ConfigEventHeader"
          },
          "index": false
        },
        {
          "name": "oldFeeRate",
          "type": "u16",
          "index": false
        },
        {
          "name": "newFeeRate",
          "type": "u16",
          "index": false
        }
      ]
    },
    {
      "name": "UpdateLockTimeEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "ConfigEventHeader"
          },
          "index": false
        },
        {
          "name": "oldLockTime",
          "type": "u64",
          "index": false
        },
        {
          "name": "newLockTime",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "UpdateMatchTimeEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "ConfigEventHeader"
          },
          "index": false
        },
        {
          "name": "oldMatchTime",
          "type": "u64",
          "index": false
        },
        {
          "name": "newMatchTime",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "UpdateTicketTokenAmountEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "ConfigEventHeader"
          },
          "index": false
        },
        {
          "name": "oldTicketTokenAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "newTicketTokenAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "UpdateLockedTokenAmountEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "PoolEventHeader"
          },
          "index": false
        },
        {
          "name": "oldLockedTokenAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "newLockedTokenAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "UpdateRewardTokenAmountEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "PoolEventHeader"
          },
          "index": false
        },
        {
          "name": "oldRewardTokenAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "newRewardTokenAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "PauseEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "PoolEventHeader"
          },
          "index": false
        }
      ]
    },
    {
      "name": "ResumeEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "PoolEventHeader"
          },
          "index": false
        }
      ]
    },
    {
      "name": "DepositRewardTokenEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "PoolEventHeader"
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
      "name": "WithdrawRewardTokenEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "PoolEventHeader"
          },
          "index": false
        },
        {
          "name": "rewardTokenToVault",
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
      "name": "PlayEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "MatchEventHeader"
          },
          "index": false
        },
        {
          "name": "funder",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "matchMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "ticketTokenAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "lockedTokenAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "rewardTokenAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "FulfillEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "MatchEventHeader"
          },
          "index": false
        },
        {
          "name": "isWin",
          "type": "bool",
          "index": false
        }
      ]
    },
    {
      "name": "UnlockEvent",
      "fields": [
        {
          "name": "header",
          "type": {
            "defined": "MatchEventHeader"
          },
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "FeeRateMaxExceeded",
      "msg": "FeeRateMaxExceeded"
    },
    {
      "code": 6001,
      "name": "Paused",
      "msg": "Paused"
    },
    {
      "code": 6002,
      "name": "TooEarly",
      "msg": "TooEarly"
    },
    {
      "code": 6003,
      "name": "Fulfilled",
      "msg": "Fulfilled"
    },
    {
      "code": 6004,
      "name": "Unlocked",
      "msg": "Unlocked"
    },
    {
      "code": 6005,
      "name": "CannotUnlock",
      "msg": "CannotUnlock"
    },
    {
      "code": 6006,
      "name": "AddOverflow",
      "msg": "AddOverflow"
    },
    {
      "code": 6007,
      "name": "SubOverflow",
      "msg": "SubOverflow"
    },
    {
      "code": 6008,
      "name": "MulOverflow",
      "msg": "MulOverflow"
    },
    {
      "code": 6009,
      "name": "DivByZero",
      "msg": "DivByZero"
    }
  ]
};
