import 'package:flame/game.dart';
import 'components/player.dart';
import 'helpers/direction.dart';

class RabbitGame extends FlameGame {

  final Player _player = Player();

  @override
  Future<void> onLoad() async {
    add(_player);
  }

  void onJoypadDirectionChanged(Direction direction) {
    _player.direction = direction;
  }
}