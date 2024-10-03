use anchor_lang::prelude::*;
use anchor_spl::token::{self, Burn, Transfer};

#[account]
#[derive(Default, Debug)]
pub struct GameConfig {
    pub authority: Pubkey,

    pub operator: Pubkey,
    pub ticket_token_mint: Pubkey,
    pub ticket_token_vault: Pubkey,

    pub transfer_authority_bump: u8,
}

impl GameConfig {
    pub const LEN: usize = 8 + std::mem::size_of::<GameConfig>();

    pub fn initialize(
        &mut self,
        authority: Pubkey,
        operator: Pubkey,
        ticket_token_mint: Pubkey,
        ticket_token_vault: Pubkey,
        transfer_authority_bump: u8,
    ) -> Result<()> {
        self.ticket_token_mint = ticket_token_mint;
        self.ticket_token_vault = ticket_token_vault;
        self.transfer_authority_bump = transfer_authority_bump;
        self.update_authority(authority);
        self.update_operator(operator);

        Ok(())
    }

    pub fn update_authority(&mut self, authority: Pubkey) {
        self.authority = authority;
    }

    pub fn update_operator(&mut self, operator: Pubkey) {
        self.operator = operator;
    }

    pub fn transfer_tokens<'info>(
        &self,
        token_program: AccountInfo<'info>,
        from: AccountInfo<'info>,
        to: AccountInfo<'info>,
        authority: AccountInfo<'info>,
        amount: u64,
    ) -> Result<()> {
        let authority_seeds: &[&[&[u8]]] =
            &[&[b"transfer_authority", &[self.transfer_authority_bump]]];

        let context = CpiContext::new(
            token_program,
            Transfer {
                from,
                to,
                authority,
            },
        )
        .with_signer(authority_seeds);

        token::transfer(context, amount)?;
        Ok(())
    }

    pub fn transfer_tokens_from_user<'info>(
        &self,
        token_program: AccountInfo<'info>,
        from: AccountInfo<'info>,
        to: AccountInfo<'info>,
        authority: AccountInfo<'info>,
        amount: u64,
    ) -> Result<()> {
        let context = CpiContext::new(
            token_program,
            Transfer {
                from,
                to,
                authority,
            },
        );
        token::transfer(context, amount)?;
        Ok(())
    }

    pub fn burn_tokens<'info>(
        &self,
        token_program: AccountInfo<'info>,
        mint: AccountInfo<'info>,
        from: AccountInfo<'info>,
        authority: AccountInfo<'info>,
        amount: u64,
    ) -> Result<()> {
        let authority_seeds: &[&[&[u8]]] =
            &[&[b"transfer_authority", &[self.transfer_authority_bump]]];

        let context = CpiContext::new(
            token_program,
            Burn {
                mint,
                from,
                authority,
            },
        )
        .with_signer(authority_seeds);

        token::burn(context, amount)?;
        Ok(())
    }
}
