import 'package:flame/game.dart';
import 'package:flutter/material.dart';
import 'package:rabbit/game.dart';

class GamePage extends StatefulWidget {
  const GamePage({Key? key}) : super(key: key);

  @override
  MainGameState createState() => MainGameState();
}

class MainGameState extends State<GamePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: const Color.fromRGBO(139, 203, 183, 1),
        body: GameWidget(
            game: RabbitGame(
                viewportResolution: Vector2(
                    MediaQuery.of(context).size.width,
                    MediaQuery.of(context).size.height
                )
            )
        )
    );
  }
}
