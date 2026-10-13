import Container from "../../components/Container/Container";
import PageTitle from "../../components/PageTiltle/PageTitle";
import Panel from "../../components/Panel/Panel";
const Login = () => {
  return (
    <Container>
      <Panel>
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <PageTitle />
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
            Register
          </span>
        </div>
      </Panel>
    </Container>
  );
};

export default Login;
