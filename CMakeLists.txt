cmake_minimum_required(VERSION 3.1)

find_package(PkgConfig)
find_package(SWIG 3.0.7 REQUIRED)

pkg_check_modules(SB REQUIRED sphinxbase>=5prealpha)
pkg_check_modules(PS REQUIRED pocketsphinx>=5prealpha)

add_subdirectory(sphinxbase)
add_subdirectory(pocketsphinx)
