import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, showDetails: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900 p-4">
                    <h1 className="text-4xl font-bold mb-4 text-red-600">Something went wrong.</h1>
                    <p className="text-lg text-gray-600 mb-8">We're sorry, but an unexpected error occurred.</p>

                    <button
                        onClick={() => this.setState(s => ({ showDetails: !s.showDetails }))}
                        className="text-indigo-600 underline text-sm mb-4"
                    >
                        {this.state.showDetails ? "Hide Details" : "Show Technical Details"}
                    </button>

                    {this.state.showDetails && (
                        <pre className="bg-gray-200 p-4 rounded text-sm text-red-600 overflow-auto max-w-2xl mb-8 border border-gray-300">
                            {this.state.error?.toString()}
                            <br />
                            {this.state.error?.stack}
                        </pre>
                    )}

                    <div className="flex gap-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-lg"
                        >
                            Refresh Page
                        </button>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-sm"
                        >
                            Go Home
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
