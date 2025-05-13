package edu.kh.project.board.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.kh.project.board.model.service.BoardService;
import lombok.extern.slf4j.Slf4j;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("board")
@Slf4j
public class BoardController {
	
	@Autowired
	private BoardService service;
	
	@GetMapping("boardType")
	public List<Map<String, Object>> boardTypeList() {
		List<Map<String, Object>> map = service.selectBoardTypeList();
		log.debug("map {}", map);
		return service.selectBoardTypeList();
	}
}
