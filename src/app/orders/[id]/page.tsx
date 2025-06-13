import Wrapper from '@/layout/wrapper';
import OrderDetailsArea from '@/app/components/order-details/order-details-area';
import styles from './page.module.css';

const OrderInvoicePage = ({ params }: { params: { id: string } }) => {
  return (
    <Wrapper>
      <div className={styles.bodyContent}>
        {/* breadcrumb start */}
        {/* <Breadcrumb title="Order Details" subtitle="Order Details" /> */}
        {/* breadcrumb end */}

        {/* order details area */}
        <div className={styles.orderDetailsContainer}>
          <OrderDetailsArea id={params.id} />
        </div>
        {/* order details area */}
      </div>
    </Wrapper>
  );
};

export default OrderInvoicePage;
