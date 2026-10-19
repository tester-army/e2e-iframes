import { test, describe } from '@e2e-dev/web';
import { expect } from 'e2e';

const ACCEPTED = { name: 'Ada Lovelace', number: '4242 4242 4242 4242', expiry: '12/30', cvc: '123' };
const DECLINED = { ...ACCEPTED, number: '4000 0000 0000 0002' };

describe('card checkout', () => {
  test('shows the cart total on the pay button', async ({ app, agent }) => {
    await app.open('/');
    await agent.assert('the pay button shows $165.00');
  });

  test('submitting an empty form shows an error under every field', async ({ app, agent, browser }) => {
    await app.open('/');
    await agent.act('click the Pay button without filling in the card form');
    await expect(browser.frameLocator('[data-testid="checkout-iframe"]').getByText('Use MM/YY.')).toBeVisible();
    await agent.assert(
      'the card form shows validation errors for the name on card, card number, expiry, and CVC fields',
    );
  });

  test('typing into a field clears its error', async ({ app, agent, browser }) => {
    const card = browser.frameLocator('[data-testid="checkout-iframe"]');
    await app.open('/');
    await agent.act('click the Pay button without filling in the card form');
    await expect(card.getByText('Enter the name on the card.')).toBeVisible();

    await agent.act('type {name} into the Name on card field', { params: { name: ACCEPTED.name } });
    await expect(card.getByText('Enter the name on the card.')).toHaveCount(0);
    await agent.assert('the card number field still shows a validation error');
  });

  test('a valid card is charged and the host shows its last four digits', async ({ app, agent, browser }) => {
    await app.open('/');
    await agent.act('fill in the card form with name {name}, card number {number}, expiry {expiry}, and CVC {cvc}', {
      params: ACCEPTED,
    });
    await agent.assert('the card number field shows 4242 4242 4242 4242 and the expiry field shows 12/30');

    await agent.act('click the Pay button');
    await expect(browser.locator('[data-testid="confirmed-last4"]')).toHaveText('4242');
    await agent.assert('the page confirms the payment with the card ending 4242 and shows no error');
  });

  test('a declined card shows the decline message on the host page', async ({ app, agent, browser }) => {
    await app.open('/');
    await agent.act('fill in the card form with name {name}, card number {number}, expiry {expiry}, and CVC {cvc}', {
      params: DECLINED,
    });
    await agent.assert('the card number field shows 4000 0000 0000 0002');

    await agent.act('click the Pay button');
    await expect(browser.locator('[data-testid="host-error"]')).toContainText('declined');
    await agent.assert('the page says the card was declined and asks to try a different card');
  });
});
