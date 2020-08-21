require("typeface-quicksand");
require("remove-focus-outline");

const React = require("react")
const Layout = require("./src/components/layout").default
const Provider = require("./src/context/globalStateContext").default

exports.wrapRootElement = Provider;

exports.wrapPageElement = ({ element }) => {
  return <Layout>{element}</Layout>
}
