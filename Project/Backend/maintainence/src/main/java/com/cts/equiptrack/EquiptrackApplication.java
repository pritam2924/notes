package com.cts.equiptrack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class EquiptrackApplication {

	public static void main(String[] args) {
		SpringApplication.run(EquiptrackApplication.class, args);
	}

}
