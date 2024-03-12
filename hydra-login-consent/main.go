package main

import (
	"fmt"
	"net/http"
	"os"

	hydraClient "github.com/ory/hydra-client-go"
)

var hydraApi *hydraClient.APIClient

func initHydraClient() {
	hydraAdminURL := os.Getenv("HYDRA_ADMIN_URL")
	if hydraAdminURL == "" {
		hydraAdminURL = "http://localhost:4445"
	}

	fmt.Printf("Hydra Admin URL: %s\n", hydraAdminURL)

	configuration := hydraClient.NewConfiguration()
	configuration.Debug = true
	configuration.Servers = []hydraClient.ServerConfiguration{
		{
			URL: hydraAdminURL,
		},
	}

	hydraApi = hydraClient.NewAPIClient(configuration)
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default port
	}

	initHydraClient()

	http.HandleFunc("/login", loginHandler)
	http.HandleFunc("/consent", consentHandler)
	http.HandleFunc("/logout", logoutHandler)

	fmt.Printf("Server listening on port %s...\n", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		fmt.Fprintf(os.Stderr, "Error when starting the server: %v\n", err)
	}
}

func loginHandler(w http.ResponseWriter, req *http.Request) {
	challenge := req.FormValue("login_challenge")
	if challenge == "" {
		http.Error(w, "No challenge found", http.StatusBadRequest)
		return
	}

	if hydraApi == nil {
		http.Error(w, "Hydra API client not initialized", http.StatusInternalServerError)
		return
	}

	resp, r, err := hydraApi.AdminApi.GetLoginRequest(req.Context()).LoginChallenge(challenge).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `AdminApi.GetLoginRequest``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}

	fmt.Fprintf(os.Stdout, "Response from `AdminApi.GetLoginRequest`: %v\n", resp)

	acceptResp, _, err := hydraApi.AdminApi.AcceptLoginRequest(req.Context()).LoginChallenge(challenge).AcceptLoginRequest(*hydraClient.NewAcceptLoginRequest("test")).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `AdminApi.AcceptLoginRequest``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}

	fmt.Fprintf(os.Stdout, "Response from `AdminApi.AcceptLoginRequest`: %v\n", resp)

	http.Redirect(w, req, acceptResp.RedirectTo, http.StatusTemporaryRedirect)
}

func consentHandler(w http.ResponseWriter, req *http.Request) {
	challenge := req.FormValue("consent_challenge")
	if challenge == "" {
		http.Error(w, "No challenge found", http.StatusBadRequest)
		return
	}

	if hydraApi == nil {
		http.Error(w, "Hydra API client not initialized", http.StatusInternalServerError)
		return
	}

	resp, r, err := hydraApi.AdminApi.GetConsentRequest(req.Context()).ConsentChallenge(challenge).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `OAuth2Api.GetConsentRequest``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}

	fmt.Fprintf(os.Stdout, "Response from `AdminApi.GetConsentRequest`: %v\n", resp)

	acceptResp, _, err := hydraApi.AdminApi.AcceptConsentRequest(req.Context()).ConsentChallenge(challenge).AcceptConsentRequest(*hydraClient.NewAcceptConsentRequest()).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `AdminApi.AcceptConsentRequest``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}

	fmt.Fprintf(os.Stdout, "Response from `AdminApi.AcceptConsentRequest`: %v\n", acceptResp)

	http.Redirect(w, req, acceptResp.RedirectTo, http.StatusTemporaryRedirect)
}

func logoutHandler(w http.ResponseWriter, req *http.Request) {
	challenge := req.FormValue("logout_challenge")
	if challenge == "" {
		http.Error(w, "No challenge found", http.StatusBadRequest)
		return
	}

	if hydraApi == nil {
		http.Error(w, "Hydra API client not initialized", http.StatusInternalServerError)
		return
	}

	resp, r, err := hydraApi.AdminApi.GetLogoutRequest(req.Context()).LogoutChallenge(challenge).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `AdminApi.GetLogoutRequest``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}

	fmt.Fprintf(os.Stdout, "Response from `AdminApi.GetLogoutRequest`: %v\n", resp)

	acceptResp, _, err := hydraApi.AdminApi.AcceptLogoutRequest(req.Context()).LogoutChallenge(challenge).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `AdminApi.AcceptLogoutRequest``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}

	fmt.Fprintf(os.Stdout, "Response from `AdminApi.AcceptLogoutRequest`: %v\n", acceptResp)

	http.Redirect(w, req, acceptResp.RedirectTo, http.StatusTemporaryRedirect)
}
