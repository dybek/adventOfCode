plugins {
    kotlin("jvm") version "1.9.21"
}

sourceSets {
    main {
        kotlin.srcDir("src")
    }
}
repositories {
    maven{
        mavenCentral()
        url = uri("https://maven.pkg.github.com/kyonifer/koma")
    }
}
dependencies{
    implementation("com.kyonifer:koma-core:0.12.1")
    implementation("com.kyonifer:koma-core-ejml:0.12.1")
    implementation("com.kyonifer:koma-core-api:0.12.1")
    implementation("com.kyonifer:koma-core-api-jvm:0.12.1")
    implementation("com.kyonifer:koma-core-api-metadata:0.12.1")
    implementation("com.kyonifer:koma-core-metadata:0.12.1")
}

tasks {
    wrapper {
        gradleVersion = "8.5"
    }
}
