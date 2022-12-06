import { test, expect } from "@playwright/test";

test("av.by-select_from_list", async ({ page }) => {
  //Go to https://av.by/
  //Verify that page is opened

  await page.goto("https://av.by/");
  if (page.locator("body.modal-open")) {
    await page.locator(".modal__footer button").click();
  }

  await expect(page).toHaveURL("https://av.by/");

  //Apply filters to find Ford Mustang

  await page.locator("span .dropdown-floatlabel__value").nth(0).click();
  await page.locator("input.dropdown__input").click();
  await page.locator("input.dropdown__input").type("ford");
  await page.keyboard.press("Enter");

  await page.locator("span.dropdown-floatlabel__value").nth(1).click();
  await page.locator("[data-item-label='Mustang']").click();

  await page.locator("a[href='https://cars.av.by/ford/mustang']").click();

  //Choose the car with the highest price

  while (
    await page.locator("//*[contains(text(), 'показать ещё')]").isVisible()
  ) {
    await page.locator(".paging__button").click();
  }

  //Get all prices

  let allPrices = await page.$$(".listing-item__priceusd");

  const pricesArr = await Promise.all(allPrices.map((el) => el.innerText()));
  const numberArr = pricesArr.map((el) => Number(el.replace(/[^0-9]/g, "")));

  let sortedArr = numberArr.sort((a, b) => b - a);

  let maxPriceFromList = sortedArr[0];
  console.log(maxPriceFromList);

  //Open car page and verify it

  await page.locator("button[title='актуальные']").click();
  await page.locator("button[data-item-label='дорогие']").click();
  await page.locator("a.listing-item__link").nth(0).click();

  const maxPriceFromItem = (
    await page.locator(".card__price-secondary span").innerText()
  ).replace(/[^0-9]/g, "");

  expect(Number(maxPriceFromItem)).toBe(maxPriceFromList);
});
