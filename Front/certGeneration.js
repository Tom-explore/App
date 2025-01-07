import devcert from 'devcert';

(async () => {
    const ssl = await devcert.certificateFor('localhost');
    console.log('Certificat généré pour localhost');
    console.log('Key path:', ssl.key);
    console.log('Cert path:', ssl.cert);
})();
