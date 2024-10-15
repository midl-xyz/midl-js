import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { waitForTransaction } from "~/actions/waitForTransaction";
import { devnet } from "~/chains";
import { satsConnect } from "~/connectors";
import { type Config, createConfig } from "~/createConfig";
import { testnet } from "~/networks";
import { setupServer } from "msw/node";
import { HttpResponse, graphql, http } from "msw";

const txId = "1";

const restHandlers = [
  http.get(`${testnet.rpcUrl}/tx/${txId}/status`, () => {
    return HttpResponse.json({
      block_height: 1,
      confirmed: true,
    });
  }),
  http.get(`${testnet.rpcUrl}/blocks/tip/height`, () => {
    return HttpResponse.text("2");
  }),
];

const server = setupServer(...restHandlers);

describe("core | actions | waitForTransaction", () => {
  let config: Config;

  //  Close server after all tests
  afterAll(() => server.close());

  // Reset handlers after each test `important for test isolation`
  afterEach(() => server.resetHandlers());

  beforeAll(() => {
    config = createConfig({
      networks: [testnet],
      chain: devnet,
      connectors: [satsConnect()],
    });

    server.listen({ onUnhandledRequest: "error" });
  });

  it("should wait for a transaction", async () => {
    expect(await waitForTransaction(config, txId)).toBeGreaterThanOrEqual(1);
  });
});
