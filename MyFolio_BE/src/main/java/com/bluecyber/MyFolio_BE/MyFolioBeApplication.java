package com.bluecyber.MyFolio_BE;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class MyFolioBeApplication {

	public static void main(String[] args) {
		SpringApplication.run(MyFolioBeApplication.class, args);
	}

}
