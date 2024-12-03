import org.jetbrains.kotlin.ir.backend.js.compile

plugins {
    kotlin("jvm") version "1.9.21"
}
repositories {
    maven("https://repo.kotlin.link")
    mavenCentral()
}
sourceSets {
    main {
        kotlin.srcDir("src")
    }
}
dependencies{
    implementation ("dev.romainguy:kotlin-math:1.5.3")
    implementation ("info.laht.threekt:core:r1-ALPHA-27")
    implementation ("org.lwjgl:lwjgl:3.3.4")
    implementation ("org.lwjgl:lwjgl-glfw:3.3.4")
    implementation ("org.lwjgl:lwjgl-opengl:3.3.4" )
    implementation ("org.lwjgl:lwjgl:3.3.4:natives-macos-arm64")
    implementation ("org.lwjgl:lwjgl-glfw:3.3.4:natives-macos-arm64")
    implementation ("org.lwjgl:lwjgl-opengl:3.3.4:natives-macos-arm64")
}


tasks {
    compileJava {
       targetCompatibility = "21"
    }
    wrapper {
        gradleVersion = "8.10.2"
    }
}

