import { test, expect } from "@playwright/test";

test("av.by", async ({ page }) => {
  //Go to https://av.by/
  //Verify that page is opened

  await page.goto("https://av.by/");
  await expect(page).toHaveURL("https://av.by/");

  //Apply filters to find Ford Mustang

  await page.locator("span .dropdown-floatlabel__value").nth(0).click();
  await page.locator("input.dropdown__input").click();
  await page.locator("input.dropdown__input").type("ford");
  await page.keyboard.press("Enter");

  await page
    .locator("(//span[@class='dropdown-floatlabel__value'])[2]")
    .click();
  await page.locator("[data-item-label='Mustang']").click();

  await page.locator("a[href='https://cars.av.by/ford/mustang']").click();

  //Choose the car with the highest price

  await page.locator("button[title='актуальные']").click();
  await page.locator("button[data-item-label='дорогие']").click();

  //Open car page and verify it

  const maxPriceFromList = await page
    .locator(".listing-item__priceusd")
    .nth(0)
    .innerText();
  await page.locator("a.listing-item__link").nth(0).click();

  const maxPriceFromItem = await page
    .locator(".card__price-secondary span")
    .innerText();
  expect(maxPriceFromItem).toMatch(maxPriceFromList);
});
