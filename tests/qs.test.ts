import { QS } from "../src/qs";

it("QS.parse", () => {
  const o = QS.parse("/?key=value");
  expect(o).toEqual({ key: "value" });
});
