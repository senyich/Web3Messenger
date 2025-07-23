<?php declare(strict_types=1);

namespace Olifanton\Ton\Transports\NullTransport;

use Brick\Math\BigNumber;
use Olifanton\Interop\Address;
use Olifanton\Interop\Boc\Cell;
use Olifanton\Ton\AddressState;
use Olifanton\Ton\Contract;
use Olifanton\Ton\Contracts\Exceptions\ContractException;
use Olifanton\Ton\Contracts\Messages\ExternalMessage;
use Olifanton\Ton\Contracts\Messages\ResponseStack;
use Olifanton\Ton\Exceptions\TransportException;
use Olifanton\Ton\Transport;
use Olifanton\Ton\Transports\Toncenter\ToncenterResponseStack;
use Olifanton\TypedArrays\Uint8Array;

class NullTransport implements Transport
{
    public function runGetMethod(Contract|Address $contract, string $method, array $stack = []): ResponseStack
    {
        try {
            if ($contract instanceof Contract) {
                $contract->getAddress();
            }
        // @codeCoverageIgnoreStart
        } catch (ContractException $e) {
            throw new TransportException(
                "Address error: " . $e->getMessage(),
                0,
                $e,
            );
        }
        // @codeCoverageIgnoreEnd

        return ToncenterResponseStack::empty();
    }

    public function send(Uint8Array | string | Cell $boc): void
    {
        // Nothing
    }

    public function sendMessage(ExternalMessage $message, Uint8Array $secretKey): void
    {
        // Nothing
    }

    public function estimateFee(Address $address,
                                Cell | Uint8Array | string $body,
                                Cell | Uint8Array | string | null $initCode = null,
                                Cell | Uint8Array | string | null $initData = null): BigNumber
    {
        return BigNumber::of(0);
    }

    public function getConfigParam(int $configParamId): Cell
    {
        return new Cell();
    }

    public function getState(Address $address): AddressState
    {
        return AddressState::UNINITIALIZED;
    }
}
