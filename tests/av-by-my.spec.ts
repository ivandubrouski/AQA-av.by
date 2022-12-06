import { test, expect } from "@playwright/test";

test("av.by", async ({ page }) => {
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

  while (await page.locator(".paging__button").isVisible()) {
    await page.locator(".paging__button").click();
  }

  let allPrices = await page.$$(".listing-item__priceusd");
  const arr: Array<number> = []; //:string[]   //Array<string|number>

  let getMaxPrice = allPrices.map(async (item) => {
    const strElement = (await item.innerText()).replace(/[^0-9]/g, "");
    arr.push(Number(strElement));
    console.log(arr);
  });

  // type name = 'sept'| 'october' |'november';
  // const month:name = 'sept';

  // interface Inum { '1' :"123", '2':'wefwef', '3':'MediaKeyMe'}
  // const a:Inum =  { '3':'MediaKeyMe'}

  let sortedArr = arr.sort((a, b) => b - a);

  console.log(arr);
  let maxPriceFromList = sortedArr[0];
  console.log(maxPriceFromList);

  //Open car page and verify it

  await page.locator("button[title='актуальные']").click();
  await page.locator("button[data-item-label='дорогие']").click();
  await page.locator("a.listing-item__link").nth(0).click();

  const maxPriceFromItem = (
    await page.locator(".card__price-secondary span").innerText()
  ).replace(/[^0-9]/g, "");
  expect(maxPriceFromItem).toBe(maxPriceFromList);
});
