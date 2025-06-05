import Wrapper from '@/layout/wrapper';
import Breadcrumb from '../components/breadcrumb/breadcrumb';
import CartArea from '../components/carts/cart-area';

export default function CartsPage() {
  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100">
        {/* breadcrumb start */}
        <Breadcrumb title="Carts" subtitle="Cart Management" />
        {/* breadcrumb end */}

        {/* cart area start */}
        <CartArea />
        {/* cart area end */}
      </div>
    </Wrapper>
  );
}
