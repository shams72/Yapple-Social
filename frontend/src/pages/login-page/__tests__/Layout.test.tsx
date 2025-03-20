import { render, screen } from '@testing-library/react';
import { Layout } from '../Layout';

// test suite for the page layout wrapper component
describe('Layout Component', () => {
  it('shows content passed as children', () => {
    render(
      <Layout>
        <div data-testid="test-child">Test Content</div>
      </Layout>
    );
    
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('has correct flex layout styles', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );
    
    const container = screen.getByText('Test Content').parentElement;
    expect(container).toHaveStyle({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    });
  });
}); 