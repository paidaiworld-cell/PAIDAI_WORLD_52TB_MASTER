#include <emscripten.h>

extern "C" {
    EMSCRIPTEN_KEEPALIVE
    int get_point_count() {
        return 5;
    }
}