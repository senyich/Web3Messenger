<?php declare(strict_types=1);

namespace Olifanton\TypedArrays;

// https://www.khronos.org/registry/typedarray/specs/latest/#7

class Float32Array extends TypedArray
{
    const BYTES_PER_ELEMENT = 4;
    const ELEMENT_PACK_CODE = 'f';
}
