export async function onRequestPost({ request, env }) {
    try {
        const formData = await request.clone().formData();
        const turnstileResponse = formData.get('cf-turnstile-response');

        if (!turnstileResponse) {
            return new Response(JSON.stringify({ success: false, message: "Validation Turnstile manquante." }), { 
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Vérification de Turnstile
        const verifyData = new URLSearchParams();
        verifyData.append('secret', env.TURNSTILE_SECRET_KEY);
        verifyData.append('response', turnstileResponse);

        const verifyReq = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: verifyData.toString(),
        });

        const verifyResult = await verifyReq.json();

        if (!verifyResult.success) {
            return new Response(JSON.stringify({ success: false, message: "Validation Turnstile échouée." }), { 
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Ajout de la clé d'accès Web3Forms au cas où elle ne serait pas dans le formulaire initial
        if (!formData.has("access_key")) {
            formData.append("access_key", "49b27977-0e55-406e-9113-345b874e22ba");
        }

        // Redirection vers Web3Forms
        const w3Response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const w3Result = await w3Response.text();

        return new Response(w3Result, { 
            status: w3Response.status,
            headers: { "Content-Type": "application/json" }
        });
        
    } catch (err) {
        return new Response(JSON.stringify({ success: false, message: "Erreur serveur : " + err.message }), { 
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
