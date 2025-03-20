import { render, screen } from '@testing-library/react';
import { Error } from '../components/Error';

// test suite for the error message component
describe('Error Component', () => {
  it('shows error when message exists and field was touched', () => {
    render(<Error errorMessage="Test error" isErrorFieldTouched={true} />);
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('shows nothing when no error message exists', () => {
    render(<Error errorMessage={undefined} isErrorFieldTouched={true} />);
    expect(screen.queryByText('Test error')).not.toBeInTheDocument();
  });

  it('shows nothing when field is untouched', () => {
    render(<Error errorMessage="Test error" isErrorFieldTouched={false} />);
    expect(screen.queryByText('Test error')).not.toBeInTheDocument();
  });
}); 