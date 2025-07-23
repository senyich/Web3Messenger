<?php declare(strict_types=1);

namespace Olifanton\Ton;

use Brick\Math\BigNumber;
use Olifanton\Interop\Address;
use Olifanton\Interop\Boc\Cell;
use Olifanton\Ton\Contracts\Messages\ExternalMessage;
use Olifanton\Ton\Contracts\Messages\ResponseStack;
use Olifanton\Ton\Exceptions\TransportException;
use Olifanton\Ton\Marshalling\Tvm\TvmStackEntry;
use Olifanton\TypedArrays\Uint8Array;

interface Transport
{
    /**
     * @param array[]|TvmStackEntry[] $stack
     * @throws TransportException
     */
    public function runGetMethod(Contract|Address $contract, string $method, array $stack = []): ResponseStack;

    /**
     * @throws TransportException
     */
    public function send(Cell | Uint8Array | string $boc): void;

    /**
     * @throws TransportException
     */
    public function sendMessage(ExternalMessage $message, Uint8Array $secretKey): void;

    /**
     * @throws TransportException
     */
    public function estimateFee(Address $address,
                                Cell | string $body,
                                Cell | string | null $initCode = null,
                                Cell | string | null $initData = null): BigNumber;

    /**
     * @throws TransportException
     */
    public function getConfigParam(int $configParamId): Cell;

    /**
     * @throws TransportException
     */
    public function getState(Address $address): AddressState;
}
