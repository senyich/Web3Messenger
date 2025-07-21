import { useEffect, useState } from "react";
import { registerUser, loginUser, getUserInfo } from "./utils/axios_requests";
import Footer from "./components/Layout/Footer";
import Header from "./components/Layout/Header";

function App() {
  const [apiResponses, setApiResponses] = useState<Array<{title: string, data: any}>>([]);

  useEffect(() => {
    const testApiEndpoints = async () => {
      try {
        const registerResponse = await registerUser({
          username: "testuser123123",
          email: "test@example.com",
          password: "testpassword123",
        });
        setApiResponses(prev => [...prev, {
          title: "✅ Register Success",
          data: registerResponse
        }]);

        const loginResponse = await loginUser({
          username: "testuser123123",
          password: "testpassword123",
        });
        setApiResponses(prev => [...prev, {
          title: "✅ Login Success",
          data: loginResponse
        }]);

        const userInfo = await getUserInfo(loginResponse.authToken);
        setApiResponses(prev => [...prev, {
          title: "✅ User Info",
          data: userInfo
        }]);

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        setApiResponses(prev => [...prev, {
          title: "❌ API Error",
          data: errorMessage
        }]);
      }
    };

    testApiEndpoints();
  }, []);

  return (
    <>
      <Header />
      <div style={{ padding: "20px" }}>
        <h2>API Test Results</h2>
        
        {apiResponses.length === 0 && <p>Testing API endpoints...</p>}
        
        {apiResponses.map((response, index) => (
          <div key={index} style={{
            marginBottom: "20px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            backgroundColor: "#f9f9f9"
          }}>
            <h3 style={{ marginTop: 0 }}>{response.title}</h3>
            <pre style={{
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              backgroundColor: "#fff",
              padding: "10px",
              borderRadius: "3px",
              border: "1px solid #eee"
            }}>
              {JSON.stringify(response.data, null, 2)}
            </pre>
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
}

export default App;