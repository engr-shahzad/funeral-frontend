import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, withRouter } from 'react-router-dom';
import { Container } from 'reactstrap';
import actions from '../../actions';

// Layout Components
const MainLayout = ({ children }) => (
  <>
    <Navigation />
    <main className="main">
      <Container style={{ maxWidth: '100vw', width: '100vw', padding: 0 }}>
        <div className="wrapper">{children}</div>
      </Container>
    </main>
    <Footer />
  </>
);

const AdminLayout = ({ children }) => (
  <main className="main">{children}</main>
);

// routes
import ObituaryPage from '../../components/Common/obituary/Obituary';
import AddObituary from '../AddObituaryForm';
import AllObituaries from '../AllObituaries';
import Login from '../Login';
import Signup from '../Signup';
import MerchantSignup from '../MerchantSignup';
import HomePage from '../Homepage';
import Dashboard from '../Dashboard';
import Support from '../Support';
import Navigation from '../Navigation';
import Authentication from '../Authentication';
import Notification from '../Notification';
import ForgotPassword from '../ForgotPassword';
import ResetPassword from '../ResetPassword';
import Shop from '../Shop';
import BrandsPage from '../BrandsPage';
import ProductPage from '../ProductPage';
import Sell from '../Sell';
import Contact from '../Contact';
import OrderSuccess from '../OrderSuccess';
import OrderPage from '../OrderPage';
import AuthSuccess from '../AuthSuccess';
import AddProduct from '../AddProduct';
import Footer from '../../components/Common/Footer';
import Page404 from '../../components/Common/Page404';
import { CART_ITEMS } from '../../constants';
import DashboardNew from '../DashboardNew';
import ProductDashboard from '../ProductDashboard';
import About from '../About';
import OurStaff from '../OurStaff';
import ContactUs from '../ContactUs';
import WhyChooseUs from '../WhyChooseUs';
import Testimonials from '../Testimonials';
import OurServices from '../OurServices';
import PrePlan from '../PrePlan';
import PreArrangementsForm from '../PreArrangementsForm';
import HaveTheTalk from '../HaveTheTalk';
import WhenDeathOccurs from '../WhenDeathOccurs';
import GriefSupport from '../GriefSupport';
import FuneralEtiquette from '../FuneralEtiquette';
import SocialSecurityBenefits from '../SocialSecurityBenefits';
import VeteransOverview from '../VeteransOverview';
import VeteransHeadstones from '../VeteransHeadstones';
import VeteransBurialFlags from '../VeteransBurialFlags';
import FAQ from '../FAQ';
import Location from '../Location';
import SendFlowers from '../SendFlowers';
import Admin from '../Admin';
import BlogList from '../Blog/Bloglist';
import BlogPage from '../Blog/Blogpage';

class Application extends React.PureComponent {
  componentDidMount() {
    const token = localStorage.getItem('token');
    if (token) this.props.fetchProfile();

    this.props.handleCart();
    window.addEventListener('storage', this.handleStorage);
  }

  handleStorage = e => {
    if (e.key === CART_ITEMS) this.props.handleCart();
  };

  render() {
    return (
      <div className="application">
        <Notification />

        <Switch>
          {/* ================= ADMIN ROUTES (NO NAVIGATION/FOOTER) ================= */}
          <Route path="/admin">
            <AdminLayout>
              <Admin />
            </AdminLayout>
          </Route>

          {/* ================= ALL OTHER ROUTES (WITH NAVIGATION/FOOTER) ================= */}
          <Route>
            <MainLayout>
              <Switch>
                <Route exact path="/" component={HomePage} />
                <Route path="/about-us" component={About} />
                <Route path="/our-staff" component={OurStaff} />
                <Route path="/contact-us" component={ContactUs} />
                <Route path="/why-choose-us" component={WhyChooseUs} />
                <Route path="/testimonials" component={Testimonials} />
                <Route path="/our-services" component={OurServices} />
                <Route path="/pre-arrangements" component={PrePlan} />
                <Route path="/prearrangements-form" component={PreArrangementsForm} />
                <Route path="/have-the-talk-of-a-lifetime" component={HaveTheTalk} />
                <Route path="/when-death-occurs" component={WhenDeathOccurs} />
                <Route path="/grief-support" component={GriefSupport} />
                <Route path="/funeral-etiquette" component={FuneralEtiquette} />
                <Route path="/social-security" component={SocialSecurityBenefits} />
                <Route path="/veterans" component={VeteransOverview} />
                <Route path="/veterans-headstones" component={VeteransHeadstones} />
                <Route path="/veterans-burial-flags" component={VeteransBurialFlags} />
                <Route path="/faqs" component={FAQ} />
                <Route path="/location" component={Location} />
                <Route path="/obituaries" component={AllObituaries} />
                <Route path="/obituary/:slug" component={ObituaryPage} />
                <Route path="/send-flowers" component={SendFlowers} />

                {/* ================= BLOG ROUTES ================= */}
                <Route exact path="/blogs" component={BlogList} />
                <Route path="/blog/:id" component={BlogPage} />

                <Route path="/add-obituary" component={Authentication(AddObituary)} />
                <Route path="/add-product" component={Authentication(AddProduct)} />

                <Route path="/shop" component={Shop} />
                <Route path="/sell" component={Sell} />
                <Route path="/contact" component={Contact} />
                <Route path="/brands" component={BrandsPage} />
                <Route path="/product/:slug" component={ProductPage} />
                <Route path="/order/success/:id" component={OrderSuccess} />
                <Route path="/order/:id" component={OrderPage} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Signup} />
                <Route path="/dashboard" component={DashboardNew} />
                <Route path="/product-dashboard" component={ProductDashboard} />
                <Route path="/merchant-signup/:token" component={MerchantSignup} />
                <Route path="/forgot-password" component={ForgotPassword} />
                <Route path="/reset-password/:token" component={ResetPassword} />
                <Route path="/auth/success" component={AuthSuccess} />
                <Route path="/support" component={Authentication(Support)} />
                <Route path="/404" component={Page404} />
                <Route path="*" component={Page404} />
              </Switch>
            </MainLayout>
          </Route>
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authenticated: state.authentication.authenticated,
  products: state.product.storeProducts
});

export default withRouter(connect(mapStateToProps, actions)(Application));