project(PocketSphinx)

execute_process(COMMAND pkg-config --variable datadir sphinxbase OUTPUT_VARIABLE SB_DATADIR OUTPUT_STRIP_TRAILING_WHITESPACE)
execute_process(COMMAND pkg-config --variable datadir pocketsphinx OUTPUT_VARIABLE PS_DATADIR OUTPUT_STRIP_TRAILING_WHITESPACE)
add_custom_command(OUTPUT "ps.cpp"
                   COMMAND swig -I${SB_DATADIR}/swig -javascript -node -DV8_VERSION=0x032872 -o ps.cpp ${PS_DATADIR}/swig/pocketsphinx.i
                   COMMENT "Generating swig bindings" )

link_directories(${PROJECT_NAME} ${PS_LIBRARY_DIRS})
add_definitions(-DBUILDING_NODE_EXTENSION)
    
add_library(${PROJECT_NAME} SHARED "ps.cpp")
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")

target_include_directories(${PROJECT_NAME} PRIVATE ${PS_INCLUDE_DIRS} ${CMAKE_JS_INC})
target_link_libraries(${PROJECT_NAME} ${PS_LIBRARIES} ${CMAKE_JS_LIB})
