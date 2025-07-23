<?php 

namespace App\Service;
use Http\Client\Common\HttpMethodsClient;
use Http\Discovery\Psr18ClientDiscovery;
use Http\Discovery\Psr17FactoryDiscovery;
use Olifanton\Interop\Address;
use Olifanton\Ton\Transports\Toncenter\ToncenterHttpV2Client;
use Olifanton\Ton\Transports\Toncenter\ClientOptions;
use Olifanton\Ton\Transports\Toncenter\ToncenterTransport;

class TonService
{
    private bool $isMainnet = false;
    private string $apiKey = "fdb59a6a05a987c582db39e58228fded02d6d0e98c691e60b3bed72c885d6f00";
    private HttpMethodsClient $httpClient;
    private ToncenterHttpV2Client $toncenter;
    private ToncenterTransport $toncenterTransport;
    public function __construct() 
    {
        $this->httpClient = new HttpMethodsClient(
    Psr18ClientDiscovery::find(),
    Psr17FactoryDiscovery::findRequestFactory(),
    Psr17FactoryDiscovery::findStreamFactory(),
        );
        $this->toncenter = new ToncenterHttpV2Client(
            $this->httpClient,
            new ClientOptions(
                $this->isMainnet ? "https://toncenter.com/api/v2" : "https://testnet.toncenter.com/api/v2",
                $this->apiKey,
            ),
        );
        $this->toncenterTransport = new ToncenterTransport($this->toncenter);
    }
    public function getWalletBalance(string $walletAddress): int
    {
        $adress = new Address($walletAddress);
        $balance = $this->toncenter->getAddressBalance($adress);
        return $balance;
    }
}