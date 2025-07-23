<?php declare(strict_types=1);

namespace Olifanton\TypedArrays;

// https://www.khronos.org/registry/typedarray/specs/latest/#7

class Uint16Array extends TypedArray
{
    const BYTES_PER_ELEMENT = 2;
    const ELEMENT_PACK_CODE = 'S';
}
