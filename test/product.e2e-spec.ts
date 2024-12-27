import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { ProductService } from "../src/product/product.service";
import { faker } from "@faker-js/faker";
import { Product } from "src/product/schemas/product.schema";
import mongoose from "mongoose";

const generateProduct = (): Product => {
  return {
    importing_ref: new mongoose.Types.ObjectId().toString(),
    code: faker.string.ulid(),
    status: "published",
    imported_t: faker.date.anytime(),
    file_name: faker.system.fileName(),
    url: faker.internet.url(),
    creator: faker.person.firstName(),
    created_t: faker.date.anytime().getTime(),
    last_modified_t: faker.date.anytime().getTime(),
    product_name: faker.commerce.productName(),
    quantity: faker.number.int() + "g",
    brands: faker.company.name(),
    categories: faker.company.name(),
    labels: faker.company.name(),
    cities: faker.location.city(),
    purchase_places: faker.location.county(),
    stores: faker.company.name(),
    ingredients_text: faker.company.catchPhrase(),
    traces: faker.word.words(10),
    serving_size: faker.number.int() + "g",
    serving_quantity: faker.number.float(),
    nutriscore_score: faker.number.int(),
    nutriscore_grade: faker.word.sample().substring(0, 1),
    main_category: faker.company.catchPhrase(),
    image_url: faker.internet.url(),
  };
};

describe("Products (e2e)", () => {
  let app: INestApplication;
  let prodService: ProductService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prodService = moduleFixture.get<ProductService>(ProductService);
    await prodService.removeAll();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("should list products return count zero and empty array", () => {
    return request(app.getHttpServer())
      .get("/products")
      .expect(200)
      .then((res) => {
        expect(res.body.count).toBe(0);
        expect(res.body.data).toEqual([]);
      });
  });

  it("should list products return 10 and 3 results", async () => {
    const generated = new Array(20).fill(0).map(() => generateProduct());
    const products = await Promise.all(
      generated.map((g) => prodService.create(g)),
    );

    return request(app.getHttpServer())
      .get("/products")
      .query({
        limit: 3,
        offset: 1,
      })
      .expect(200)
      .then((res) => {
        expect(res.body.count).toBe(products.length);
        expect(res.body.data).toHaveLength(3);
      });
  });

  it("should show product", async () => {
    const product = await prodService.create(generateProduct());

    return request(app.getHttpServer())
      .get("/products/" + product._id)
      .expect(200)
      .then((res) => {
        expect(res.body.code).toBe(product.code);
      });
  });

  it("should return not found when show invalid product", async () => {
    return request(app.getHttpServer()).put("/products/invalid").expect(404);
  });

  it("should create new product", async () => {
    const product = generateProduct();

    return request(app.getHttpServer())
      .post("/products")
      .send(product)
      .expect(201)
      .then((res) => {
        expect(res.body.code).toBe(product.code);
      });
  });

  it("should update a product", async () => {
    const product = await prodService.create(generateProduct());
    return request(app.getHttpServer())
      .put("/products/" + product._id)
      .send({ code: "xpto12345" })
      .expect(200)
      .then((res) => {
        expect(res.body.code).toBe("xpto12345");
      });
  });

  it("should return not found when update invalid product", async () => {
    return request(app.getHttpServer())
      .put("/products/invalid")
      .send({ x: 1 })
      .expect(404);
  });

  it("should destroy a product", async () => {
    const product = await prodService.create(generateProduct());
    return request(app.getHttpServer())
      .delete("/products/" + product._id)
      .expect(200);
  });

  it("should return not found when destroy invalid product", async () => {
    return request(app.getHttpServer()).delete("/products/invalid").expect(404);
  });
});
